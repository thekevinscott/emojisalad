'use strict';

const config = {
  apiKey: 'key-e0021a0af069c6d2fba29aa4909afb2a',
  domain: 'sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org'
};

const Mailgun = require('mailgun').Mailgun;
const mg = new Mailgun(config.apiKey);

module.exports = function(responses, purpose = '', callee = '') {
  const recipients = [
    'thekevinscott@gmail.com'
  ];
  const sender = 'alerts@emojinaryfriend.com';
  const subject = `Tripwire ${purpose} on Bot`;
  const body = `A tripwire was tripped on bot, at section ${callee}, at ${new Date()}. The messages are: ${JSON.stringify(responses, null, 2)}`;
  console.log('send message');
  mg.sendText(sender,
           recipients,
           subject,
           body,
           (err) => {
             console.log('callback');
             if ( err ) {
               console.error('Error sending email', err);
             } else {
               console.log('email sent successfully');
             }
           });
}

