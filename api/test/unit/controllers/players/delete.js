const Promise = require('bluebird');
const post = require('test/support/request').post;
const del = require('test/support/request').del;

const Player = require('models/player');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Delete', function() {
  before(function() {
    game_number = '+15559999999';
    return post({ url: '/users', data: { from: from, nickname: nickname }}).then((res) => {
      let user_id = res.body.id;
      const player_params = { user_id: user_id, to: game_number };
      return post({ url: '/players', data: player_params});
    });
  });

  it('should return an error for a nonexistent player', function() {
    return del({ url: `/players/foo` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should delete a player', function() {
    return Player.findOne({ from: from }).then((player) => {
      const params = {
        url: `/players/${player.id}`, 
      };
      return del(params).then((res) => {
        res.statusCode.should.equal(200);
      });
    }).then(() => {
      return Player.find({ from: from });
    }).then((players) => {
      players.length.should.equal(0);
      return Player.find({ from: from, archived: 1 });
    }).then((players) => {
      players.length.should.equal(1);
    });
  });

});
