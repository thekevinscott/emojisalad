'use strict';

// The expected message containing the game phrase
const regex = /(.*)Your phrase is: (.*)\n\n/;

const getPhrase = (messages) => {
  // There should only be a single message
  // in the array with a messages object returned;
  // this would correlate to the second invite above,
  // which kicks off the game
  const message = messages.filter((message) => {
    return message.messages;
  }).pop().messages.filter((message) => {
    return regex.test(message.body)
  }).pop();

  return message.body.match(regex).pop();
}

module.exports = getPhrase;
