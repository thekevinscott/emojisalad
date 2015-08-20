function checkScenario(regex, pattern) {
  var regex;
  if ( regex.flags ) {
    regex = RegExp(regex.pattern, regex.flags);
  } else {
    regex = RegExp(regex.pattern);
  }
  return regex.test(pattern);
}

module.exports = checkScenario;
