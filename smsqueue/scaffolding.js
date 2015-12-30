const pmx = require('pmx');
let DEBUG = (process.env.DEBUG !== undefined) ? process.env.DEBUG : true;
console.debug = function() {
  if ( DEBUG === true || DEBUG === 'true' ) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift(new Date());
    console.log.apply(null, args);
  }
};
let consoleError = console.error;
console.error = function() {
  let args = Array.prototype.slice.call(arguments);
  args.unshift(new Date());
  consoleError.apply(null, args);
};
pmx.action('debug:on', function(reply) {
  console.log('debug is on');
  DEBUG = true;
  reply({DEBUG : DEBUG});
});
pmx.action('debug:off', function(reply) {
  console.log('debug is off');
  DEBUG = false;
  reply({DEBUG : DEBUG});
});
