// tests that a single player can sign up and get onboarded
require('./signup');

// tests that a player can invite other players,
// and those players can get onboarded
require('./invite');

// tests that a player can submit an emoji clue
// for other players to guess to
require('./submission');

// tests that guessing works correctly
require('./guessing');

// tests that clues work correctly
require('./clues');

// tests that asking for help works correctly
require('./help');

// tests that game mechanics work, such as inviting
// in the middle of a game, moving on to the next
// round, playing with three or more players
require('./game');

// tests for multiple games
require('./multiple');

/*
// tests that passing works correctly
require('./pass');
*/
