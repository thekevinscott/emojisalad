'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

const getPhones = messages => {
  const phones = messages.reduce((obj, message) => {
    return {
      ...obj,
      [message.number]: true,
    };
  }, {});

  return Object.keys(phones).map(phone => phone);
};

const getJungleSubmissions = (ids) => {
  const protocol = 'nexmo';
  const service = registry.get(protocol);
  if ( service && service.api && service.api.jungle ) {
    const payload = {
      url: service.api.jungle.endpoint,
      method: service.api.jungle.method,
      //qs: {
        //id: ids[protocol]
      //}
    };
    return request(payload).then((response) => {
      if ( ! response || ! response.body ) {
        throw response;
      }
      let body = response.body;

      // if err, already parsed
      try { body = JSON.parse(body); } catch (err) {
        // nada
      }

      return getPhones(body);
    }).catch((err) => {
      console.error(err);
      throw err;
    });
  }
};

module.exports = getJungleSubmissions;
