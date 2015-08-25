var Promise = require('bluebird');
var checkScenario = require('./checkScenario');
var mapActions = require('./mapActions');
var parseInput = require('./parseInput');
var _ = require('lodash');


/*
 * mapScenarios will iterate over an array of scenarios
 * and run the first one that passes a regex check
 * */
function mapScenarios(scenarios, data) {
  for ( var i=0, l=scenarios.length; i<l; i++ ) {
    var scenario = scenarios[i];
    var mostRecentInput = data.inputs.pop();
    if ( checkScenario.call(null, scenario.regex, mostRecentInput) ) {
      data.inputs.push(parseInput(scenario.regex, mostRecentInput));

      return mapActions.call(null, scenario.actions, data).then(function(resp) {
        return resp;
      });
      break;
    }
  }
  return Promise.reject(new Error({
    message: 'No valid scenarios found'
  }))    
}

module.exports = mapScenarios;
