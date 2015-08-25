function checkScenario(scenarioRegex, pattern) {
  var regex;
  if ( scenarioRegex.flags ) {
    regex = RegExp(scenarioRegex.pattern, scenarioRegex.flags);
  } else {
    regex = RegExp(scenarioRegex.pattern);
  }
  console.log('the test', regex.test(pattern), regex, pattern);
  return regex.test(pattern);
}

module.exports = checkScenario;
