const post = require('test/support/request').post;

const User = require('models/user');
const users = require('routes/users');
let game_number;
describe('Users', function() {
  require('./create');
  require('./find');
  require('./update');
  require('./delete');
});
