'use strict';
const validate = require("email-validator").validate;

const Email = {
  parse: (passed_email) => {
    console.info('get ready to parse email', passed_email);
    return new Promise((resolve, reject) => {
      //const result = validate(passed_email);
      //console.log('parsed_email', parsed_email);
      if ( validate(passed_email) ) {
        resolve( passed_email );
      } else {
        reject(new Error('Invalid email'));
      }
    });
  }
};

module.exports = Email;
