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

    var user_id;
    if ( user && user.id ) {
      user_id = user.id;
    }
    mixpanel.track(state, {
      user_id: user_id,
      input: input,
      platform: 'twilio'
    });

  }
}
