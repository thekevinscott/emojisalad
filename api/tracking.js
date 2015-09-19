'use strict';
const ua = require('universal-analytics');
const Mixpanel = require('mixpanel');

let mixpanel = Mixpanel.init(require('../config/mixpanel')[process.env.ENVIRONMENT]);
const ua_config = require('../config/google-analytics')[process.env.ENVIRONMENT];

module.exports = function(state, user, input) {
  if ( process.env.ENVIRONMENT === 'production' ) {
    var visitor = ua(ua_config, user.id, {
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
};
