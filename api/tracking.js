var ua = require('universal-analytics');
var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init('95ea55113750200c91effcaade70941b');

module.exports = function(state, user, input) {
  if ( process.env.ENVIRONMENT === 'production' ) {
    var visitor = ua('UA-67117728-1', user.id, {
      strictCidFormat: false,
      https: true
    });

    visitor.event({
      ec: state,
      ea: input,
    }).send();

    mixpanel.track(state, {
      user_id: user.id,
      input: input,
      platform: 'twilio'
    });

  }
}
