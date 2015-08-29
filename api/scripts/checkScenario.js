function checkScenario(scenarioRegex, pattern) {
  var regex;
  if ( scenarioRegex.flags ) {
    regex = RegExp(scenarioRegex.pattern, scenarioRegex.flags);
  } else {
    regex = RegExp(scenarioRegex.pattern);
  }
  console.log(regex, pattern, regex.test(pattern));
  return regex.test(pattern);
}

module.exports = checkScenario;
