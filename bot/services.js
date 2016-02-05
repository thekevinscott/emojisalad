'use strict';
const Promise = require('bluebird');
const services = {};
const callbacks = {};
const d = require('node-discover')();

const get = (key) => {
  //console.log('get 1');
  return new Promise((resolve) => {
    //console.log('get 2', key);
    if ( services[key] ) {
      //console.log('get 3');
      resolve(services[key]);
    } else {
      //console.log('get 4');
      callbacks[key] = (service) => {
        //console.log('get 5');
        resolve(service);
      }
    }
  });
}

const required_services = [
  'api',
  'testqueue'
];

module.exports = services;
module.exports.init = (port) => {
  return new Promise((resolve) => {
    d.advertise({
      name: 'bot',
      ready: false,
      port: port
    });

    d.on("added", (obj) => {
      if ( obj && obj.advertisement ) {
        //console.log('service is added', obj);
        const service = obj.advertisement;
        services[service.name] = service;
        const required_length = required_services.filter((required) => {
          if ( services[required] && services[required].ready ) {
            //console.log(required, 'its good');
            return required;
            //} else {
            //console.log(required, 'it is not good');
          }
        }).length;
        //console.log(required_length, required_services.length);
        if ( required_length >= required_services.length -1 ) {
          d.advertise({
            name: 'bot',
            ready: true,
            port: port,
            endpoints: {
              ping: {
                url: `http://localhost:${port}/ping`
              }
            }
          });
          resolve();
        }
      }
    });

    return services;
  });
}

module.exports.d = d;
module.exports.get = get;
