/* eslint-disable no-console */
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

const phoneContraint = {
  phone: {
    presence: true,
    format: {
      pattern: /\+[1-9]\d{1}[0-9]\d{3,14}/,
      flags: 'i',
      message: 'not valid',
    },
  },
};

exports.constraints = constraints;
exports.phoneContraint = phoneContraint;

/*
const testData = {
  username: 'jakub|frydrych',
  domain: 'nemp.io',
  firstname: 'Jakub',
  lastname: 'Frydrych',
  birthdate: '2023-04-12',
  phone: '+420777777777',
  password: 'alfass',
  confirmPassword: 'alfass',
};


function success(attributes) {
  console.log('Success!', attributes);
}

function error(errors) {
  if (errors instanceof Error) {
    // This means an exception was thrown from a validator
    console.err('An error ocurred', errors);
  } else {
    console.log('Validation errors', errors);
  }
}

validate.async(testData, constraints).then(success, error);
*/
