'use strict';

const join_string = '\n\n'

const concatenate = function(messages) {
  let keys = {};
  console.debug('messages', messages);
  if ( ! messages.length ) {
    throw "No messages provided";
  }
  for ( let i=0; i < messages.length; i++ ) {
    let message = messages[i];
    if ( ! message.body) {
      throw "No body provided";
    }
    if ( ! message.to) {
      throw "No To provided";
    }
    if ( ! message.from) {
      throw "No from provided";
    }
    console.debug('message', message);
    let key = message.to+message.from;
    if ( !keys[key] ) {
      keys[key] = [];
    }
    keys[key].push(message);
  }
  console.debug('keys', keys);
  const combined_messages = Object.keys(keys).map(function(key) {
    return keys[key].reduce(function(output, response) {
      if (! output) {
        output = {
          to: response.to,
          from: response.from,
          body: [response.body]
        };
      } else {
        output.body.push(response.body);
      }
      return output;
    }, null);
  });
  console.debug('combined messages', combined_messages);
  
  const joined_messages = combined_messages.map(function(response) {
    response.body = response.body.join(join_string);
    return response;
  });
  console.debug('joined messages', joined_messages);

  return joined_messages;
};

module.exports = concatenate;
module.exports.join_string = join_string;
