/* eslint-disable max-len */
/* eslint-disable no-console */
const fs = require('fs');
const http = require('http');
const https = require('http2');
const http2express = require('http2-express-bridge');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validate = require('validate.js');
const Database = require('./database');
const Encryption = require('./encryption');
const { verifySMSCode, sendSMScode } = require('./bulkgate');
const { phoneConstraint, constraints } = require('./validate');

const REGISTRATION_EP = '/registration';
const SEND_SMS_EP = '/sms-verification';
const VERIFY_EP = '/verify';

const httpPort = 3000;
const httpsPort = 443;

const certPath = '/etc/letsencrypt/live/nemp.nemp.io/';
const certPriv = `${certPath}privkey.pem`;
const certPub = `${certPath}cert.pem`;
const certChain = `${certPath}chain.pem`;

const db = new Database();

async function updateUserAccountOptId(username, otpId) {
  const data = await db.write(`UPDATE users SET otpId = '${otpId}' WHERE username = '${username}'`);
  return data;
}

async function updateUserAccountConfirmOptId(otpId) {
  console.log('updateUserAccountConfirmOptId', otpId);
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const data = await db.write(`UPDATE users SET confirmedTimestamp = '${timestamp}' WHERE otpId = '${otpId}'`);
  return data;
}

async function userExist(username) {
  const isUserExist = await db.read('SELECT id FROM users WHERE username = $1', [username]);
  let result = false;
  if (isUserExist.length !== 0) {
    result = true;
  }

  console.log('userExist', username, result, isUserExist);
  return result;
}

async function phoneExist(phone) {
  const isPhoneExist = await db.read('SELECT id FROM users WHERE phone = $1', [phone]);
  let result = false;
  if (isPhoneExist.length !== 0) {
    result = true;
  }

  console.log('phoneExist', phone, result, isPhoneExist);
  return result;
}

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
      data.birthday,
      data.gender,
    ],
  );

  return result;
}

async function createPhoneVerification(phone, optId) {
  const result = await db.write(
    `INSERT INTO verification ( phone, optId ) 
    VALUES ($1, $2)`,
    [
      phone,
      optId,
    ],
  );

  return result;
}

let certsExist = true;
if (fs.existsSync(certPriv) && fs.existsSync(certPub) && fs.existsSync(certChain)) {
  certsExist = true;
}

if (certsExist) {
  const app = http2express(express);
  app.use(bodyParser.json());
  app.use(cors());

  /*
  app.use((req, res, next) => {
    if (!req.secure) return res.redirect(301, `https://${req.headers.host}:${httpsPort}${req.url}`);
    next();
  }); */

  this.httpServer = http.createServer(app).listen(httpPort);
  console.log(`HTTP server running on port: ${httpPort}`);

  /*
  this.httpsServer = https.createSecureServer({
    key: fs.readFileSync(certPriv), cert: fs.readFileSync(certPub), ca: fs.readFileSync(certChain), allowHTTP1: true,
  }, app).listen(httpsPort);
  console.log(`HTTPS server running on port: ${httpsPort}`);
*/

  app.post(REGISTRATION_EP, async (req, res) => {
    if (!req.body) {
      res.status(400);
      return;
    }

    validate.async(req.body, constraints).then(async (success) => {
      const { username, phone } = success;

      const isUserExist = await userExist(username);
      if (isUserExist) {
        res.json({
          success: false,
          errors: ['The username has already been registered'],
        });
        return;
      }

      const bulkgate = await sendSMScode(phone).then(
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

      const createAccountStatus = await createUserAccount(success);

      if (createAccountStatus && createAccountStatus.error) {
        console.log('create user error', createAccountStatus.error);
        res.json({
          success: false,
          errors: ['Unknown error - please try again later'],
        });
        return;
      }

      await updateUserAccountOptId(username, bulkgate.data.id);

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

  app.post(SEND_SMS_EP, async (req, res) => {
    console.log('send sms verification', req.body);
    const { countryCode, phoneNumber } = req.body;
    const phone = `${countryCode}${phoneNumber}`;

    validate.async(phone, phoneConstraint).then(async () => {
      const isPhoneExist = await phoneExist(phone);
      if (isPhoneExist) {
        res.json({
          success: false,
          errors: ['Phone number has already been registered'],
        });
      }

      const bulkgate = await sendSMScode(phone).then(
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

      await createPhoneVerification(phone, bulkgate.data.id);

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

    if (bulkgate.error) {
      res.json({
        success: false,
        errors: [bulkgate.error],
      });
      return;
    }

    if (bulkgate.data.error) {
      res.json({
        success: false,
        errors: [bulkgate.data.error],
      });
      return;
    }

    if (!bulkgate.data.verified) {
      res.json({
        success: false,
        errors: ['Invalid code'],
      });
      return;
    }

    await updateUserAccountConfirmOptId(req.body.optId);

    res.json({
      success: true,
    });
  });
}
