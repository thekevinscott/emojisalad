var ua = require('universal-analytics');
var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init('95ea55113750200c91effcaade70941b');

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

    mixpanel.track("Twilio Request", {
      user_id: user_id,
      state: state,
      input: input
    });

  }
}
