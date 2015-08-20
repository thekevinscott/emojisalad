var Promise = require('bluebird');
var checkScenario = require('./checkScenario');
var mapActions = require('./mapActions');


/*
 * mapScenarios will iterate over an array of scenarios
 * and run the first one that passes a regex check
 * */
function mapScenarios(scenarios, data) {
  if ( ! data ) {
    data = {};
  }
  for ( var i=0, l=scenarios.length; i<l; i++ ) {
    var scenario = scenarios[i];
    if ( checkScenario.call(null, scenario.regex, data.incomingPattern) ) {
      return mapActions.call(null, scenario.actions, data, null);
      break;
    }
  }
  return Promise.reject(new Error({
    message: 'No valid scenarios found'
  }))    
}

module.exports = mapScenarios;
