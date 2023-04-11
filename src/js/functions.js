const formErrors = ['Some error'];

function showStep2() {
  document.querySelector('.registration__step-1').classList.add('registration__step--hidden');
  document.querySelector('.registration__step-2').classList.remove('registration__step--hidden')
}

function showFormError() {

}

function hideFormError() {

}

function validateForm() {
  showStep2();
  sendSMScode();
}

async function sendSMScode() {
  const bulkGateUrl = 'https://portal.bulkgate.com/api/1.0/otp/send';
  const data = {
    application_id: '',
    application_token: '',
    number: '420XXXXXX',
    language: 'en',
    code_type: 'int',
    code_length: 6,
    request_quota_number: 2,
    request_quota_identification: '127.0.0.1',
    expiration: 3600,
    channel: {
      sms: {
        sender_id: 'gText',
        sender_id_value: 'Nemp.io',
        unicode: true
      }
    }
  }

  const response = await fetch(bulkGateUrl, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  response.json().then((data) => {
    if (data.error) {

    }
    console.log(data);
  });
}