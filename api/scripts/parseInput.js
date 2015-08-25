function parseInput(scenarioRegex, pattern) {
  if ( scenarioRegex.match ) {
    if ( scenarioRegex.match.flags ) {
      regex = new RegExp(scenarioRegex.match.pattern, scenarioRegex.match.flags);
    } else {
      regex = new RegExp(scenarioRegex.match.pattern);
    }
    var matches = regex.exec(pattern);
    //var matches = /^invite\s*(.*)/.exec(pattern);
    if ( matches && matches.length ) {
      return matches[1];
    } else {
      return null;
    }
  } else {
    return pattern;
  }
}

module.exports = parseInput;
