const Promise = require('bluebird');
const post = require('test/support/request').post;
const put = require('test/support/request').put;

const Player = require('models/player');
const players = require('routes/players');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Update', function() {
  before(function() {
    game_number = '+15559999999';
    return post({ url: '/users', data: { from: from, nickname: nickname }}).then((res) => {
      let user_id = res.body.id;
      const player_params = { user_id: user_id, to: game_number };
      return post({ url: '/players', data: player_params});
    });
  });

  it('should return an error for a nonexistent player', function() {
    return put({ url: `/players/foo` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should return an error for a nonexistent key', function() {
    return Player.findOne({ from: from, to: game_number }).then((player) => {
      const params = {
        url: `/players/${player.id}`, 
        data: { foo: 'bar' }
      };
      return put(params).then((res) => {
        res.statusCode.should.equal(400);
      });
    });
  });

  it('should update a player', function() {
    const new_to = '+15551111111';
    return Player.findOne({ from: from, to: game_number }).then((player) => {
      const params = {
        url: `/players/${player.id}`, 
        data: { to: new_to }
      };
      return put(params).then((res) => {
        res.statusCode.should.equal(200);
        res.body.id.should.equal(player.id);
        res.body.from.should.equal(player.from);
        res.body.avatar.should.equal(player.avatar);
        res.body.nickname.should.equal(nickname);
        res.body.to.should.equal(new_to);
      }).then(() => {
        return Player.findOne({ from: from });
      }).then((player) => {
        player.to.should.equal(new_to);
      });
    });
  });

});

