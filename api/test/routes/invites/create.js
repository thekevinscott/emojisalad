const post = require('test/support/request').post;

const User = require('models/user');
const Invite = require('models/invite');
const game_number = '+15559999999';
describe('Create', function() {
  const from = Math.random();
  let game;
  let inviter;

  before(() => {
    return User.create({ from: from }).then((user) => {
      const payload = [{ id: user.id }];
      return post({
        url: '/games',
        data: payload
      })
    }).then((res) => {
      game = res.body;
      inviter = game.players[0];
    });
  });

  describe('Invalid', function() {
    it('should reject without an inviter_id', function() {
      return post({
        url: `/games/${game.id}/invite`,
        data: { foo: 'bar' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide an inviter_id');
      });
    });

    it('should reject with an invalid inviter_id', function() {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: 'bar', invites: ['foo'] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid inviter_id');
      });
    });

    it('should reject with a non existent user id', function() {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: 999999, invites: ['foo'] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid inviter_id');
      });
    });

    it('should reject without invites', function() {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: inviter.id }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid invite');
      });
    });

    it('should reject without valid invites', function() {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: inviter.id, invites: 'foo' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide valid invites');
      });
    });
  });

  describe('Valid', function() {

    it('should create an invite', function() {
      const invited = Math.random();
      const payload = {
        inviter_id: inviter.id,
        invites: [ invited ]
      };
      return post({
        url: `/games/${game.id}/invite`,
        data: payload
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('id');
        res.body.should.have.property('inviter');
        res.body.should.have.property('invited');
      });
    });

    it('should not create multiple invites for the same game for the same user', () => {
    });

    it('should create multiple invites for the same game for the same user, so long as the previous ones have all been used', () => {
    });

    it('should not create an invite for someone already in a game', () => {
    });

    it('should not create an invite for a blacklisted user', () => {
    });

    it('should not create an invite for a user playing the maximum number of games', () => {
    });
  });
});
