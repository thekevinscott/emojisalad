function checkScenario(regex, incomingPattern) {
  var regex;
  if ( regex.flags ) {
    regex = RegExp(regex.pattern, regex.flags);
  } else {
    regex = RegExp(regex.pattern);
  }
  return regex.test(incomingPattern);
}

module.exports = checkScenario;
