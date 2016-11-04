const join_string = '\n\n';
const _ = require('lodash');

module.exports = function preprocessSend(messages) {
  const keys = {};
  if ( ! messages.length ) {
    console.info('no messages provided');
    throw new Error("No messages provided");
  }
  for ( var i=0; i < messages.length; i++ ) {
    var message = messages[i];
    if ( ! message.body) {
      console.info('no body');
      throw new Error("No body provided");
    }
    if ( ! message.to) {
      throw new Error("No To provided");
    }
    if ( ! message.from) {
      throw new Error("No from provided");
    }
    var key = message.to+message.from;
    if ( !keys[key] ) {
      keys[key] = [];
    }
    keys[key].push(message);
  }
  const combined_messages = Object.keys(keys).map(function(key) {
    return keys[key].reduce(function(output, response) {
      if (! output) {
        output = _.extend({}, response, {
          body: [response.body]
        });
      } else {
        output.body.push(response.body);
      }
      return output;
    }, null);
  });

  const joined_messages = combined_messages.map(function(response) {
    response.body = response.body.join(join_string);
    return response;
  });

  return joined_messages;
};
