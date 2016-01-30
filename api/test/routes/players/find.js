const Promise = require('bluebird');
const post = require('test/support/request').post;
const get = require('test/support/request').get;

const Player = require('models/player');
const players = require('routes/players');
let game_number;
let user_id;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Find', function() {
  before(function() {
    game_number = '+15559999999';
    return post({ url: '/users', data: { from: from, nickname: nickname }}).then((res) => {
      user_id = res.body.id;
      const payload = [{ id: user_id }];
      return post({
        url: '/games',
        data: payload
      })
    });
  });

  it('should return a list of all players', function() {
    return get({ url: '/players' }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('to', game_number);
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('nickname');
      res.body[0].should.have.property('user_id');
      res.body[0].should.have.property('archived');
      res.body[0].should.have.property('blacklist');
      res.body[0].should.have.property('user_archived');
    });
  });

  it('should return a list of all players matching a from', function() {
    return get({ url: '/players', data: { from: from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from', from);
    });
  });

  it('should return a list of all players matching a nickname', function() {
    return get({ url: '/players', data: { from: from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from', from);
    });
  });

  describe('findOne', function() {
    it('should only accept numeric IDs', function() {
      return get({ url: `/players/foo` }).then((res) => {
        //console.log('res', res);
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for a player not found', function() {
      return get({ url: `/players/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single player', function() {
      return Player.find().then((players) => {
        let player = players[0];
        return get({ url: `/players/${player.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(player.id);
          res.body.from.should.equal(player.from);
          res.body.to.should.equal(player.to);
          res.body.nickname.should.equal(player.nickname);
          new Date(res.body.created).should.equalDate(player.created);
          res.body.user_id.should.equal(player.user_id);
          res.body.should.have.property('avatar');
          res.body.should.have.property('archived');
          res.body.should.have.property('blacklist');
          res.body.should.have.property('user_archived');
        });
      });
    });
  });
});

