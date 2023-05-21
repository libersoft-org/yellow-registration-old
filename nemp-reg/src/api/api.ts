import { userDataIF } from "../App";

const backendDomain = 'http://localhost:3000';
const REGISTRATION_EP = `${backendDomain}/registration`;
const SEND_SMS_EP = `${backendDomain}/sms-verification`;
const VERIFY_EP = `${backendDomain}/verify`;

export async function apiSendVerificationSMS(countryCode: string, phoneNumber: string) {
  console.log('create', countryCode, phoneNumber);
  const response = await fetch(SEND_SMS_EP, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({countryCode, phoneNumber}),
  });

  return response.json();
}

export async function apiVerifySMSCode(optId: string, code: string) {
  console.log('verify', optId, code);
  const response = await fetch(VERIFY_EP, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({optId, code}),
  });

  return response.json();
}

export async function apiFinishRegistration(userData: userDataIF) {
  console.log('finish', userData);
  const response = await fetch(REGISTRATION_EP, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}