const get = require('test/support/request').get;
const post = require('test/support/request').post;

const User = require('models/user');
const Invite = require('models/invite');
const Game = require('models/game');

describe('Find', function() {
  let game;
  let inviter;
  const from = 'foo' + Math.random();

  before(() => {
    return User.create({ from: Math.random() }).then((user) => {
      return Game.create([{ id: user.id }]);
    }).then((res) => {
      game = res;
      inviter = game.players[0];
      return Invite.create({
        inviter_id: inviter.id,
        invites: [ from ]
      });
    }).then(() => {
      return Invite.create({
        inviter_id: inviter.id,
        invites: [ Math.random() ]
      }).then((invites) => {
        return Invite.use(invites[0].id);
      });
    });
  });

  it('should find some invites', () => {
    return get({
      url: `/games/${game.id}/invites`
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('game');
      res.body[0].should.have.property('inviter_player');
      res.body[0].should.have.property('invited_user');
      res.body[0].inviter_player.should.have.property('id');
      res.body[0].invited_user.should.have.property('id');
      res.body[0].invited_user.should.have.property('from');
      res.body[0].should.have.property('used');
    });
  });

  it('should find some invites without a game id', () => {
    return get({
      url: `/invites`
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('game');
      res.body[0].should.have.property('inviter_player');
      res.body[0].should.have.property('invited_user');
      res.body[0].inviter_player.should.have.property('id');
      res.body[0].invited_user.should.have.property('id');
      res.body[0].invited_user.should.have.property('from');
      res.body[0].game.should.have.property('id');
      res.body[0].should.have.property('used');
    });
  });

  it('should find some specific invites', () => {
    return get({
      url: `/invites`,
      data: { invited_from: from }
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('game');
      res.body[0].should.have.property('inviter_player');
      res.body[0].should.have.property('invited_user');
      res.body[0].inviter_player.should.have.property('id');
      res.body[0].invited_user.should.have.property('id');
      res.body[0].invited_user.should.have.property('from', from);
      res.body[0].game.should.have.property('id');
      res.body[0].should.have.property('used');
    });
  });

  describe('findOne', function() {
    it('should only accept numeric IDs', function() {
      return get({ url: `/invites/foo` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for an invite not found', function() {
      return get({ url: `/invites/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single player', function() {
      //const number = 'foo' + Math.random();
      return Invite.findOne().then((invite) => {
        return get({ url: `/invites/${invite.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.should.have.property('id');
          res.body.should.have.property('game');
          res.body.should.have.property('inviter_player');
          res.body.should.have.property('invited_user');
          res.body.inviter_player.should.have.property('id');
          res.body.invited_user.should.have.property('id');
          res.body.invited_user.should.have.property('from');
          res.body.game.should.have.property('id');
          res.body.should.have.property('used');
        });
      });
    });
  });
});
