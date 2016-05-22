import Promise from 'bluebird';
const registry = require('microservice-registry');

export default function getService(name) {
  const pinging_interval = 50;
  return new Promise((resolve) => {
    if ( registry.get(name) ) {
      resolve(registry.get(name).api);
    } else {
      const interval = setInterval(() => {
        if ( registry.get(name) ) {
          clearInterval(interval);
          resolve(registry.get(name).api);
        }
      }, pinging_interval);
    }
  });
}

