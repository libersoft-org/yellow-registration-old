const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 5,
      maximum: 20,
    },
    format: {
      pattern: /^[a-zA-Z0-9.-]+$/,
      flags: 'i',
      message: 'not valid',
    },
  },
  domain: {
    presence: true,
  },
  firstname: {
    presence: true,
  },
  lastname: {
    presence: true,
  },
  birthdate: {
    presence: true,
    format: {
      pattern: /(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))/,
      flags: 'i',
      message: 'not valid',
    },
  },
  gender: {
    presence: true,
  },
  phone: {
    presence: true,
    format: {
      pattern: /\+[1-9]\d{1}[0-9]\d{3,14}/,
      flags: 'i',
      message: 'not valid',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 100,
    },
  },
  confirmPassword: {
    presence: true,
    equality: 'password',
  },
};


function showStep2() {
  document.querySelector('.registration__step-1').classList.add('registration__step--hidden');
  document.querySelector('.registration__step-2').classList.remove('registration__step--hidden');
}

function showStep3() {
  document.querySelector('.registration__step-2').classList.add('registration__step--hidden');
  document.querySelector('.registration__step-3').classList.remove('registration__step--hidden');
}

function verifySMSCode() {
  const data = {
    optId: document.getElementById('optid').value,
    code: document.getElementById('code').value,
  }
  sendSMSCode(data).then((response) => {
    if (response.errors) {
      showFormError(response.errors, 2);
      return;
    }
    hideFormError(2);
    showStep3();
  }).catch((error) => {
    showFormError([error.message], 2);
  });
}

function showFormError(errors, step) {
  console.log(errors);
  const errorsEl = document.getElementById(`form-errors-step${step}`);
  errorsEl.classList.add('form__errors--active');
  errorsEl.innerText = errors.join('\n');
}

function hideFormError(step) {
  const errorsEl = document.getElementById(`form-errors-step${step}`);
  errorsEl.classList.remove('form__errors--active');
  errorsEl.innerText = '';
}

function validateForm() {
  const formData = {
    username: document.getElementById('username').value,
    domain: document.getElementById('domain').value,
    firstname: document.getElementById('firstname').value,
    lastname: document.getElementById('lastname').value,
    gender: document.getElementById('gender').value,
    birthdate: document.getElementById('birthdate').value,
    phone: `${document.getElementById('phoneprefix').value}${document.getElementById('phone').value}`,
    password: document.getElementById('password').value,
    confirmPassword: document.getElementById('confirmpassword').value,
  }

  validate.async(formData, constraints).then(async (success) => {
    hideFormError(1);
    console.log(success);
    await createUserAccount(success).then((data) => {
      if (data.errors) {
        showFormError(data.errors, 1);
        return;
      }

      const url = new URL(location);
      url.searchParams.set("otpid", data.bulkgate.data.id);
      history.pushState({}, "", url);
      document.getElementById('optid').value = data.bulkgate.data.id;

      showStep2();
    }).catch((error) => {
      showFormError([error.message], 1);
    });

  }).catch((errors) => {
    let errorsArr = [];
    Object.keys(errors).forEach((errorKey) => {
      errorsArr = errorsArr.concat(errors[errorKey]);
    });
    showFormError(errorsArr, 1);
  })
}

async function createUserAccount(data) {
  console.log('create', data);
  const response = await fetch('http://127.0.0.1:3000/registration', {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

async function sendSMSCode(data) {
  console.log('verify', data);
  const response = await fetch('http://127.0.0.1:3000/verify', {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
