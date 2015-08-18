/*
 * processScenarios takes an array of possibilities
 * and iterates over each one
 * */
function processScenarios(scenarios, message, user, origBody) {
  if ( ! origBody ) { origBody = message; }
  for ( var i=0, l=branches.length; i<l; i++ ) {
    var branch = branches[i];
    var regex;
    if ( branch.regex.flags ) {
      regex = RegExp(branch.regex.pattern, branch.regex.flags);
    } else {
      regex = RegExp(branch.regex.pattern);
    }
    if ( regex.test(message) ) {
      console.log('we match', regex, message);
      var promises = branch.scenarios.map(function(action) {
        if ( methods[action.type] ) {
          console.log('method exists', action.type);
          return methods[action.type](action, message, user, origBody);
        } else {
          throw "Action type does not exist: " + action.type;
        }
      });
      console.log('return set of promises');
      return Q.allSettled(promises).then(function() {
        console.log('all promises done');
      });
      break;
    } else {
      console.log('dont match', regex, message);
    }
  }
}

module.exports = processScenarios;
