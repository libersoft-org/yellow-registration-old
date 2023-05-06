const backendDomain = 'http://localhost:3000';
const REGISTRATION_EP = '/registration';
const SEND_SMS_EP = `${backendDomain}/sms-verification`;
const VERIFY_EP = '/verify';

export async function apiSendVerificationSMS(countryCode: string, phoneNumber: string) {
  // console.log('create', data);
  const response = await fetch(SEND_SMS_EP, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({countryCode, phoneNumber}),
  });

  return response.json();
}