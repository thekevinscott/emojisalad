// tests that a single user can sign up and get onboarded
require('./signup');
// tests that a user can invite other users,
// and those users can get onboarded
require('./invite');

// tests that a user can submit an emoji clue
// for other users to guess to
require('./submission');

// tests that game mechanics work, such as inviting
// in the middle of a game, moving on to the next
// round, playing with three or more players
require('./game');

// tests that guessing works correctly
require('./guessing');

// tests that clues work correctly
require('./clues');
