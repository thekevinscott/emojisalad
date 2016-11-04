const Promise = require('bluebird');
const post = require('test/support/request').post;
const get = require('test/support/request').get;

const Player = require('models/player');
let game_number;
let user_id;
const protocol = 1;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Find', () => {
  before(() => {
    game_number = 2;
    return post({ url: '/users', data: { from, nickname, protocol }}).then((res) => {
      user_id = res.body.id;
      const payload = { users: [{ id: user_id, to: game_number }] };
      return post({
        url: '/games',
        data: payload
      });
    });
  });

  it('should return a list of all players', () => {
    return get({ url: '/players' }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      //res.body[0].should.have.property('to', game_number);
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('nickname');
      res.body[0].should.have.property('user_id');
      res.body[0].should.have.property('archived');
      res.body[0].should.have.property('blacklist');
      res.body[0].should.have.property('user_archived');
    });
  });

  it('should return a list of all players matching a from', () => {
    return get({ url: '/players', data: { from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from', from);
    });
  });

  it('should return a list of all players matching a nickname', () => {
    return get({ url: '/players', data: { from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from', from);
    });
  });

  describe('findOne', () => {
    it('should only accept numeric IDs', () => {
      return get({ url: `/players/foo` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for a player not found', () => {
      return get({ url: `/players/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single player', () => {
      return Player.find().then((players) => {
        const player = players[0];
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

