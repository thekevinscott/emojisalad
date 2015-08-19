var Promise = require('bluebird');
var checkScenario = require('./checkScenario');
var routeScenario = require('./routeScenario');


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
      return routeScenario.call(null, scenario.scenarios, data, null);
      break;
    }
  }
  return Promise.reject(new Error({
    message: 'No valid scenarios found'
  }))    
}

module.exports = mapScenarios;
