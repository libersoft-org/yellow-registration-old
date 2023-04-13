/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validate = require('validate.js');
const Database = require('./database');
const Encryption = require('./encryption');
const { verifySMSCode, sendSMScode } = require('./bulkgate');
const constraints = require('./validate');

const PORT = 3000;
const REGISTRATION_EP = '/registration';
const VERIFY_EP = '/verify';

const db = new Database();
const app = express();
app.use(bodyParser.json());
app.use(cors());

async function createUserAccount(data) {
  const result = await db.write(
    `INSERT INTO users (username, pass, firstname, lastname, phone, birthday, gender) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      data.username,
      await Encryption.getHash(data.password),
      data.firstname,
      data.lastname,
      data.phone,
      data.birtday,
      data.gender,
    ],
  );

  return result;
}

async function updateUserAccountOptId(username, otpId) {
  const data = await db.write(`UPDATE users SET otpId = '${otpId}' WHERE username = '${username}'`);
  return data;
}

async function updateUserAccountConfirmOptId(otpId) {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const data = await db.write(`UPDATE users SET confirmedTimestamp = '${timestamp}' WHERE otpId = '${otpId}'`);
  return data;
}

app.post(REGISTRATION_EP, (req, res) => {
  if (!req.body) {
    res.status(400);
  }

  validate.async(req.body, constraints).then(async (success) => {
    const createAccountStatus = await createUserAccount(success);

    if (createAccountStatus && createAccountStatus.error) {
      res.json({
        success: false,
        errors: [`${createAccountStatus.error.code === 'SQLITE_CONSTRAINT' ? 'The username has already been registered' : 'Unknown error - try again'}`],
      });
      return;
    }

    const bulkgate = await sendSMScode(req.body.phone).then(
      (bulkgateResponse) => bulkgateResponse,
    ).catch((error) => {
      console.log(error);
      return { error: error.message };
    });

    if (bulkgate.error) {
      res.json({
        success: false,
        errors: [bulkgate.error],
      });
      return;
    }

    await updateUserAccountOptId(req.body.username, bulkgate.data.id);

    res.json({
      success: true,
      bulkgate,
    });
  }, (errors) => {
    if (errors instanceof Error) {
      console.err('An error ocurred', errors);
      res.status(500);
    } else {
      console.log('Validation errors', errors);
      res.json({
        success: false,
        errors,
      });
    }
  });
});

app.post(VERIFY_EP, async (req, res) => {
  console.log('verify', req.body);
  const bulkgate = await verifySMSCode(req.body.optId, req.body.code);

  if (bulkgate.data.error) {
    res.json({
      success: false,
      errors: [bulkgate.data.error],
    });
  }

  if (!bulkgate.data.verified) {
    res.json({
      success: false,
      errors: ['Invalid code'],
    });
  }

  await updateUserAccountConfirmOptId(req.body.optId);

  res.json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Nemp registration run on port ${PORT}`);
});
