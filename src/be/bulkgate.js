const fetch = require('node-fetch');

const SERVER_IP = '127.0.0.1';
const BULKGATE_APPID = '29824';
const BULKGATE_TOKEN = 'vLWszKqcUQZVFUgJm0diaWKI2UxU8wgvd3SeGVEECWrpAirrTy';

// https://help.bulkgate.com/docs/cs/http-one-time-password-send.html
async function sendSMScode(phone) {
  console.log(`Send SMS to ${phone}`);
  const bulkGateUrl = 'https://portal.bulkgate.com/api/1.0/otp/send';
  const body = {
    application_id: BULKGATE_APPID,
    application_token: BULKGATE_TOKEN,
    number: phone,
    language: 'en',
    code_type: 'int',
    code_length: 6,
    request_quota_number: 10,
    request_quota_identification: SERVER_IP,
    expiration: 3600,
    channel: {
      sms: {
        sender_id: 'gText',
        sender_id_value: 'Nemp.io',
        unicode: true,
      },
    },
  };

  const response = await fetch(bulkGateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

// https://help.bulkgate.com/docs/cs/http-one-time-password-verify.html
async function verifySMSCode(optId, code) {
  const bulkGateUrl = 'https://portal.bulkgate.com/api/1.0/otp/verify';
  const body = {
    application_id: BULKGATE_APPID,
    application_token: BULKGATE_TOKEN,
    id: optId,
    code,
  };

  const response = await fetch(bulkGateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

module.exports = {
  verifySMSCode,
  sendSMScode,
};
