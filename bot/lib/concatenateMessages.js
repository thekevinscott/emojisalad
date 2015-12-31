'use strict';

const concatenate = function(responses) {
  let tos = {};
  for ( var i=0; i<responses.length; i++ ) {
    let response = responses[i];
    console.debug('response', response);
    let to = response.to;
    if ( !tos[to] ) {
      tos[to] = [];
    }
    tos[to].push(response);
  }
  console.debug('tos', tos);
  let newResponses = Object.keys(tos).map(function(to) {
    return tos[to].reduce(function(output, response) {
      if (! output) {
        output = {
          to: response.to,
          from: response.from,
          message: [response.message]
        };
      } else {
        output.message.push(response.message);
      }
      return output;
    }, null);
  }).map(function(response) {
    response.message = response.message.join('\n\n');
    return response;
  });

  return newResponses;
};

module.exports = concatenate;
