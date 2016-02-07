'use strict';
const pmx = require('pmx');

let LOG_LEVEL = (process.env.LOG_LEVEL !== undefined) ? process.env.LOG_LEVEL : 'warning';
console.info = function() {
  if ( LOG_LEVEL === 'info' ) {
    let args = Array.prototype.slice.call(arguments);
    console.debug.apply(null, args);
  }
};
console.debug = function() {
  if ( LOG_LEVEL === 'info' || LOG_LEVEL === 'warning' ) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(new Date());
    console.log.apply(null, args);
  }
};
let consoleError = console.error;
console.error = function() {
  if ( LOG_LEVEL === 'info' || LOG_LEVEL === 'warning' || LOG_LEVEL === 'error' ) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(new Date());
    consoleError.apply(null, args);
  }
};

['info','warning','error'].map(function(key) {
  pmx.action('LOG_LEVEL:' + key, function(reply) {
    console.log('LOG_LEVEL is: ' + key);
    LOG_LEVEL = key;
    reply({LOG_LEVEL : key});
  });
});
