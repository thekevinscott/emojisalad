'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const queue_services = require('config/services').queues;

const getMessages = (timestamp) => {
  const queues = process.env.QUEUES.split(',');
  return Promise.all(queues.map((queue) => {
    console.log(queues);
    if ( queue_services[queue] ) {
      return request({
        url: queue_services[queue].received,
        method: 'GET',
        qs: {
          date: timestamp
        }
      }).then((response) => {
        let body = response.body;

        try { body = JSON.parse(body);
        } catch(err) {} // if err, already parsed
        return body;
      });
    } else {
      throw `Queue not defined for ${queue}`;
    }
  })).then((responses) => {
    return responses.reduce((obj, response) => {
      return obj.concat(response);
    }, []);
  });

  return body;
};

module.exports = getMessages;
