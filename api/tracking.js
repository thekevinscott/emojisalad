var ua = require('universal-analytics');

module.exports = function(state, user_id, input) {
  if ( 1 || process.env.ENVIRONMENT === 'production' ) {
    var visitor = ua('UA-67117728-1', user_id, {
      strictCidFormat: false,
      https: true
    });

    visitor.event({
      ec: 'Twilio View',
      ea: state,
      ev: input
    }).send();

  }
}
