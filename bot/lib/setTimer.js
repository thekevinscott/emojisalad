const sendMessages = require('lib/sendMessages');
const Message = require('models/message');
const registry = require('microservice-registry');

const timers = {};

// so, this should set a timer.
// a separate function should pull timers and process them.
// there should also be a way to clear timers.
const setTimer = (game, messages, timeout) => {
  timers[game.id] = setTimeout(() => {
    const messages_with_protocol = messages.filter((message) => {
      return registry.get(message.protocol);
    });
    return Message.parse(messages_with_protocol).then((parsed_messages) => {
      return sendMessages(parsed_messages);
    });
  }, timeout);
};

const clear = (game) => {
  clearTimeout(timers[game.id]);
};

module.exports = setTimer;

module.exports.clear = clear;
