'use strict';

// The expected message containing the game phrase
const regex = [
  /(.*)Your phrase is: (.*)\n\n/,
  /(.*)your phrase is: (.*)\n\n/,
];

const getPhrase = (messages) => {
  // There should only be a single message
  // in the array with a messages object returned;
  // this would correlate to the second invite above,
  // which kicks off the game
  const resultingMessages = messages.filter(msg => {
    return msg && msg.messages;
  }).pop().messages.filter(msg => {
    return regex.map(r => {
      return r.test(msg.body);
    }).filter(el => el).length > 0;
  });
  const message = resultingMessages.pop();

  if (!message || !message.body) {
    console.log('***** error in get phrase');
    messages.forEach(msg => {
      if (msg.messages) {
        console.log('Initiated ID', msg.initiated_id);
        msg.messages.forEach(m => {
          console.log(m.id, m.body);
        });
      } else {
        console.log(msg);
      }
    });
    throw new Error('Unable to get the actual message body');
  }
  return regex.map(r => {
    return message.body.match(r);
  }).filter(el => el).pop().pop();
};

module.exports = getPhrase;
