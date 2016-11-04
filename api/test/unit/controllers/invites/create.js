const post = require('test/support/request').post;

const proxyquire = require('proxyquire');
const User = require('models/user');
const Game = require('models/game');
const Invite = require('models/invite');
const game_number = '1';
const game_numbers = [
  '1',
  '2',
  '3',
  '4',
  '5'
];
const protocol = 'testqueue';
const to = game_number;
describe('Create', () => {
  const from = Math.random();
  let game;
  let inviter;

  before(() => {
    return User.create({ from, protocol }).then((user) => {
      const payload = { users: [{ id: user.id, to: 1 }] };
      return post({
        url: '/games',
        data: payload
      });
    }).then((res) => {
      game = res.body;
      inviter = game.players[0];
    });
  });

  describe('Invalid', () => {
    it('should reject without an inviter_id', () => {
      return post({
        url: `/games/${game.id}/invite`,
        data: { foo: 'bar' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide an inviter_id');
      });
    });

    it('should reject with an invalid inviter_id', () => {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: 'bar', invites: ['foo'] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid inviter_id');
      });
    });

    it('should reject with a non existent user id', () => {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: 999999, invitee: 'foo' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid inviter_id');
      });
    });

    it('should reject without invites', () => {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: inviter.id }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid invite');
      });
    });

    it('should reject without valid invites', () => {
      return post({
        url: `/games/${game.id}/invite`,
        data: { inviter_id: inviter.id, invites: '' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid invitee');
      });
    });
  });

  describe('Valid', () => {

    const createInvite = (inviter_id, invitee) => {
      const payload = {
        inviter_id,
        invitee: {
          from: invitee,
          protocol: 'testqueue'
        }
      };
      return post({
        url: `/games/${game.id}/invite`,
        data: payload
      });
    };

    it('should create an invite', () => {
      const invitee = 'foo'+Math.random();
      return createInvite(inviter.id, invitee).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('id');
        res.body.should.have.property('game');
        res.body.should.have.property('inviter_player');
        res.body.should.have.property('invited_user');
        res.body.inviter_player.should.have.property('id', inviter.id);
        res.body.invited_user.should.have.property('id');
        res.body.invited_user.should.have.property('from', invitee);
        res.body.invited_user.should.have.property('to', inviter.to);
        res.body.game.should.have.property('id');
      });
    });

    it('should not create multiple invites for the same game for the same user', () => {
      const invitee = 'foo'+Math.random();
      return createInvite(inviter.id, invitee).then(() => {
        return createInvite(inviter.id, invitee);
      }).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.be.above(0);
        res.body.should.have.property('error');
        res.body.error.should.contain('Invite already exists for');
        res.body.should.have.property('code', 1200);
      });
    });

    it('should create multiple invites for the same game for the same user, so long as the previous ones have all been used and the user is not in a game', () => {
      const invitee = 'foo'+Math.random();
      return createInvite(inviter.id, invitee).then((res) => {
        return Invite.use(res.body.id);
      }).then(() => {
        return createInvite(inviter.id, invitee);
      }).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.be.above(0);
        res.body.should.have.property('id');
        res.body.should.have.property('game');
        res.body.should.have.property('inviter_player');
        res.body.should.have.property('invited_user');
        res.body.inviter_player.should.have.property('id', inviter.id);
        res.body.invited_user.should.have.property('id');
        res.body.invited_user.should.have.property('from', invitee);
        res.body.game.should.have.property('id');
      });
    });

    it('should not create an invite for someone already in a game', () => {
      const new_user = 'foo'+Math.random();

      return User.create({ from: new_user, protocol }).then((user) => {
        user.to = to;
        return Game.add(game, [ user ]).then(() => {
          const payload = {
            inviter_id: inviter.id,
            invitee: {
              from: new_user,
              protocol
            }
          };
          return post({
            url: `/games/${game.id}/invite`,
            data: payload
          });
        });
      }).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.equal(1);
        res.body.should.have.property('error');
        res.body.error.should.contain('already in game');
        res.body.should.have.property('code', 1205);
      });
    });

    it('should not create an invite for a blacklisted user', () => {
      const invitee = 'foo'+Math.random();
      return User.create({ from: invitee, protocol }).then((user) => {
        return User.update(user, { blacklist: 1 });
      }).then(() => {
        return createInvite(inviter.id, invitee);
      }).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.be.above(0);
        res.body.should.have.property('error');
        res.body.error.should.contain('User has asked not to be contacted');
        res.body.should.have.property('code', 1202);
      });
    });

    it('should not create an invite for a user playing the maximum number of games', () => {
      const invitee = 'foo'+Math.random();
      return User.create({ from: invitee, protocol }).then((user) => {
        return User.update(user, { maximum_games: 2 });
      }).then((user) => {
        const promises = [];
        for (let i = 0; i < user.maximum_games; i++) {
          const player = {
            id: user.id,
            to: game_numbers[i]
          };
          promises.push(Game.create([ player ]));
        }
        return Promise.all(promises);
      }).then(() => {
        return createInvite(inviter.id, invitee);
      }).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.be.above(0);
        res.body.should.have.property('error');
        res.body.error.should.contain('User is playing the maximum');
        res.body.should.have.property('code', 1204);
      });
    });

    it('should not be able to invite yourself', () => {
      return createInvite(inviter.id, [ inviter.from ]).then((res) => {
        res.statusCode.should.equal(200);
        //res.body.length.should.be.above(0);
        res.body.should.have.property('error');
        res.body.error.should.contain('You can\'t invite yourself');
        res.body.should.have.property('code', 1203);
      });
    });
  });
});
