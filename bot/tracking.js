'use strict';
const ua = require('universal-analytics');
const Mixpanel = require('mixpanel');

let mixpanel = Mixpanel.init(require('../config/mixpanel')[process.env.ENVIRONMENT]);
const ua_config = require('../config/google-analytics')[process.env.ENVIRONMENT];

module.exports = function(state, player, input) {
  if ( process.env.ENVIRONMENT === 'production' ) {
    var visitor = ua(ua_config, player.id, {
      strictCidFormat: false,
      https: true
    });

    visitor.event({
      ec: state,
      ea: input,
    }).send();

    var player_id;
    if ( player && player.id ) {
      player_id = player.id;
    }
    mixpanel.track(state, {
      player_id: player_id,
      input: input,
      platform: 'twilio'
    });

  }
};
