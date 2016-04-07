const Promise = require('bluebird');
const post = require('test/support/request').post;
const get = require('test/support/request').get;

const User = require('models/user');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Find', () => {
  before(() => {
    game_number = '+15559999999';
    return Promise.all([
      post({ url: '/users', data: { protocol: 'testqueue', from, to: game_number }}),
      post({ url: '/users', data: { protocol: 'testqueue', from: from+'a', to: game_number }}),
      post({ url: '/users', data: { protocol: 'testqueue', from: Math.random(), to: game_number, nickname }})
    ]);
  });

  it('should return a list of all users', () => {
    return get({ url: '/users' }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('blacklist');
    });
  });

  it('should return a list of all users matching a from', () => {
    return get({ url: '/users', data: { from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(2);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('blacklist');

      res.body[0].from.should.contain(from);
    });
  });

  it('should return a list of all users matching a nickname', () => {
    return get({ url: '/users', data: { nickname }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('nickname', nickname);
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('players');
      res.body[0].should.have.property('confirmed_avatar');
      res.body[0].should.have.property('blacklist');
    });
  });

  it.only('should return associated players with each user', () => {
    const nickname = 'foobar';
    return createUser(nickname).then((user) => {
      return createUser(nickname);
    }).then(() => {
      return get({ url: '/users', data: { nickname }});
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body[0].should.have.property('players');
      res.body[1].should.have.property('players');
      res.body[0].players.length.should.equal(1);
      res.body[1].players.length.should.equal(1);
      const first_player = res.body[0].players[0];
      const second_player = res.body[1].players[0];
      first_player.should.have.property('to');
      second_player.should.have.property('to');
      first_player.to.should.be.a('string');
      second_player.to.should.be.a('string');
      // tos should be actual numbers
      first_player.to.substring(0,1).should.equal('+');
      second_player.to.substring(0,1).should.equal('+');
    });
  });

  describe('findOne', () => {
    it('should only accept numeric IDs', () => {
      return get({ url: `/users/foo` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for a user not found', () => {
      return get({ url: `/users/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single user', () => {
      return User.find().then((users) => {
        const user = users[0];
        return get({ url: `/users/${user.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(user.id);
          res.body.from.should.equal(user.from);
          res.body.nickname.should.equal(user.nickname);
          res.body.should.have.property('blacklist');
          res.body.should.have.property('confirmed');
          res.body.should.have.property('confirmed_avatar');
          res.body.should.have.property('avatar');
          res.body.should.have.property('created');
          res.body.should.have.property('players');
        });
      });
    });

    it('should return all the players associated with a user', () => {
      return createUser(Math.random()).then((user) => {
        return get({ url: `/users/${user.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(user.id);
          res.body.players.length.should.be.above(0);
        });
      });
    });
  });
});

function createUser(nickname) {
  return post({ url: '/users', data: { from: Math.random(), to: game_number, protocol: 'testqueue', nickname: nickname+Math.random() }}).then((res) => {
    const user = res.body;
    return post({
      url: '/games',
      data: { users: [{ id: user.id }] }
    }).then(() => {
      return user;
    });
  });
}

