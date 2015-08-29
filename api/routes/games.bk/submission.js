var User = require('../../models/user');
var Game = require('../../models/game');
var EmojiData = require('emoji-data');

module.exports = function(req, res) {
  var user_id = req.body.user_id;

  var user = {
      id: user_id
  };

  var message = req.body.message;
  if ( ! parseEmoji(message) ) {
    return res.json({ 
      error: {
        message: 'Not valid Emoji',
        errno: 9
      }
    });
  }

  return Game.saveSubmission(user, message).then(function(game) {
    res.json(game);
  }).catch(function(err) {
    console.log('error parsing submission', err);
    res.json( err );
  });
};

function parseEmoji(str) {
  var FBS_REGEXP = new RegExp("(?:" + (EmojiData.chars({
    include_variants: true
  }).join("|")) + ")", "g");

  str = str.replace(FBS_REGEXP, '').trim();
  if ( str.length > 0 ) {
    // this means non-emoji characters exist in the string
    return false;
  } else {
    return true;
  }
}
