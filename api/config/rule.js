'use strict';
const sprintf = require('sprintf');
//const regexps = {
  //phone: '[(]{0,1}[0-9]{3}[)]{0,1}[-\\s\\.]{0,1}[0-9]{3}[-\\s\\.]{0,1}[0-9]{4}'
//};

const rules = {
  'clue': {
    pattern: '^clue(.*)',
    flags: 'i',
    example: [
      'clue'
    ]
  },
  'guess': {
    pattern: '^guess(.*)',
    flags: 'i',
    example: [
      'guess '
    ]
  },
  'help': {
    pattern: '^help(.*)',
    flags: 'i',
    example: [
      'help'
    ]
  },
  'invite': {
    pattern: '^invite(.*)',// + snippets.phone+'$',
    flags: 'i',
    example: [
      'invite '
    ]
  },
  'new-game': {
    pattern: '^new game',
    flags: 'i',
    example: [
      'new game'
    ]
  },
  'pass': {
    pattern: '^pass(.*)',
    flags: 'i',
    example: [
      'pass'
    ],
  },
  'phrase': {
    pattern: '^%(phrase)s',
    flags: 'i'
  },
  'yes': {
    pattern: '^yes|^yeah|^yea|^y$',
    flags: 'i',
    example: [
      'yes',
      'yeah',
      'yea',
      'y'
    ]
  }
};

function createRegExp(pattern, flags) {
  if ( flags ) {
    return RegExp(pattern, flags);
  } else {
    return RegExp(pattern);
  }
}

module.exports = function(key, options) {
  var regex;

  if ( ! options ) {
    options = {};
  }

  if ( rules[key] ) {
    let pattern = sprintf(rules[key].pattern, options);
    regex = createRegExp(pattern, rules[key].flags);
  }
  return {
    test: function(input) {
      return regex.test(input.trim());
    },
    match: function(input) {
      return input.match(regex).pop().trim();
    },
    example: function() {
      if ( !rules[key] ) {
        throw "No rule found for "+key;
      }
      var examples = rules[key].example;
      return examples[Math.floor(Math.random()*examples.length)];
    }
  };
};

