const post = require('test/support/request').post;
const put = require('test/support/request').put;

const User = require('models/user');
const Invite = require('models/invite');
const Game = require('models/game');

describe('Use', () => {
  const from = Math.random();
  const protocol = 'testqueue';
  let game;
  let inviter;

  before(() => {
    return User.create({ from, protocol }).then((user) => {
      const payload = [{ id: user.id }];
      return Game.create(payload);
    }).then((res) => {
      game = res;
      inviter = game.players[0];
    });
  });

  it('should be able to use an invite', () => {
    const from = 'foo' + Math.random();
    return Invite.create({ inviter_id: inviter.id, invitee: { from, protocol } }).then((invite) => {
      const url = `/games/${game.id}/invites/${invite.id}/use`;
      return post({
        url
      });
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id');
      res.body.should.have.property('game');
      res.body.should.have.property('inviter_player');
      res.body.should.have.property('invited_user');
      res.body.inviter_player.should.have.property('id', inviter.id);
      res.body.invited_user.should.have.property('id');
      res.body.invited_user.should.have.property('from', from);
      res.body.game.should.have.property('id');
      res.body.should.have.property('used', 1);
    });
  });
});
