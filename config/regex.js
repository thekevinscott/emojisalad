var snippets = {
  phone: '[(]{0,1}[0-9]{3}[)]{0,1}[-\\s\\.]{0,1}[0-9]{3}[-\\s\\.]{0,1}[0-9]{4}'
}

var REGEX = {
  phone: {
    pattern: '^'+snippets.phone+'$'
    //pattern: snippets.phone
  },
  'invite': {
    pattern: '^invite ',// + snippets.phone+'$',
    flags: 'i'
  }
}

module.exports = function(key) {
  if ( REGEX[key] ) {
    if ( REGEX[key]['flags'] ) {
      return RegExp(REGEX[key]['pattern'], REGEX[key]['flags']);
    } else {
      return RegExp(REGEX[key]['pattern']);
    }
  }
};
