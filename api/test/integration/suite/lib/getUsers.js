var _ = require('lodash');
// if a number is the argument, this is the number of users
// to create.
//
// if an array is the argument, this is intended to stand
// in as the users we wish to create. fill in the missing
// fields

var listOfNicknames = [
  'Ari',
  'Kevin',
  'SCHLOOOOO',
  'Dave'
];
function getUsers(arg) {
  var users = [];
  if ( _.isNumber(arg) ) {
    for ( var i=0;i<arg;i++ ) {
      users.push({
        number: getRandPhone(),
        nickname: listOfNicknames[i]
      });
    }
  } else if ( _.isArray(arg) ) { 
    var nicknameCount = 0;
    users = arg;
    users.map(function(user) {
      if ( ! user.phone ) {
        user.phone = getRandPhone()
      }
      if ( ! user.nickname ) {
        user.nickname = listOfNicknames[nicknameCount++];
      }
    });
  }
  return users;
}

function getRandPhone() {
  return '+186046'+Math.floor(10000 + Math.random() * 90000);
}

module.exports = getUsers;
