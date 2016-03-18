const sendMessages = require('lib/sendMessages');
const Message = require('models/message');

const timers = {};

// so, this should set a timer.
// a separate function should pull timers and process them.
// there should also be a way to clear timers.
const setTimer = (game, messages, timeout) => {
  timers[game.id] = setTimeout(() => {
    return Message.parse(messages).then((parsed_messages) => {
      return sendMessages(parsed_messages);
    });
  }, timeout);
};

const clear = (game) => {
  clearTimeout(timers[game.id]);
};

module.exports = setTimer;

module.exports.clear = clear;
