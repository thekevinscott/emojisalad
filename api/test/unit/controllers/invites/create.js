const post = require('test/support/request').post;

const proxyquire = require('proxyquire');
const User = require('models/user');
const Game = require('models/game');
const game_number = '+15559999999';
const game_numbers = [
  '+15551111111',
  '+15552222222',
  '+15553333333',
  '+15554444444',
  '+15559999999'
];
const protocol = 1;
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
        data: { inviter_id: 999999, invites: ['foo'] }
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
        data: { inviter_id: inviter.id, invites: 'foo' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide valid invites');
      });
    });
  });

  describe('Valid', () => {

    const createInvite = (inviter_id, invites) => {
      const payload = {
        inviter_id,
        invites
      };
      return post({
        url: `/games/${game.id}/invite`,
        data: payload
      });
    };

    it.only('should create an invite', () => {
      const invited = 'foo'+Math.random();
      return createInvite(inviter.id, [ invited ]).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('game');
        res.body[0].should.have.property('inviter_player');
        res.body[0].should.have.property('invited_user');
        res.body[0].inviter_player.should.have.property('id', inviter.id);
        res.body[0].invited_user.should.have.property('id');
        res.body[0].invited_user.should.have.property('from', invited);
        res.body[0].invited_user.should.have.property('to', inviter.to);
        res.body[0].game.should.have.property('id');
      });
    });

    it('should not create multiple invites for the same game for the same user', () => {
      const invited = 'foo'+Math.random();
      return createInvite(inviter.id, [ invited ]).then(() => {
        return createInvite(inviter.id, [ invited ]);
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('error');
        res.body[0].error.should.contain('Invite already exists for');
        res.body[0].should.have.property('code', 1200);
      });
    });

    it('should create multiple invites for the same game for the same user, so long as the previous ones have all been used and the user is not in a game', () => {
      const invited = 'foo'+Math.random();
      return createInvite(inviter.id, [ invited ]).then((res) => {
        return Invite.use(res.body[0].id);
      }).then(() => {
        return createInvite(inviter.id, [ invited ]);
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('game');
        res.body[0].should.have.property('inviter_player');
        res.body[0].should.have.property('invited_user');
        res.body[0].inviter_player.should.have.property('id', inviter.id);
        res.body[0].invited_user.should.have.property('id');
        res.body[0].invited_user.should.have.property('from', invited);
        res.body[0].game.should.have.property('id');
      });
    });

    it('should not create an invite for someone already in a game', () => {
      const new_user = 'foo'+Math.random();

      return User.create({ from: new_user }).then((user) => {
        return Game.add(game, [ user ]).then(() => {
          const payload = {
            inviter_id: inviter.id,
            invites: [ new_user ]
          };
          return post({
            url: `/games/${game.id}/invite`,
            data: payload
          });
        });
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.equal(1);
        res.body[0].should.have.property('error');
        res.body[0].error.should.contain('already playing game');
        res.body[0].should.have.property('code', 1203);
      });
    });

    it('should not create an invite for a blacklisted user', () => {
      const invited = 'foo'+Math.random();
      return User.create({ from: invited }).then((user) => {
        return User.update(user, { blacklist: 1 });
      }).then(() => {
        return createInvite(inviter.id, [ invited ]);
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('error');
        res.body[0].error.should.contain('User has asked not to be contacted');
        res.body[0].should.have.property('code', 1202);
      });
    });

    it('should not create an invite for a user playing the maximum number of games', () => {
      const invited = 'foo'+Math.random();
      return User.create({ from: invited }).then((user) => {
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
        return createInvite(inviter.id, [ invited ]);
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('error');
        res.body[0].error.should.contain('User is playing the maximum');
        res.body[0].should.have.property('code', 1204);
      });
    });

    it('should not be able to invite yourself', () => {
      return createInvite(inviter.id, [ inviter.from ]).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.be.above(0);
        res.body[0].should.have.property('error');
        res.body[0].error.should.contain('You can\'t invite yourself');
        res.body[0].should.have.property('code', 1203);
      });
    });

    describe('Multiple invites at once', () => {
      it('should be able to invite two people at once', () => {
        const invites = [
          'foo'+Math.random(),
          'foo'+Math.random()
        ];
        return createInvite(inviter.id, invites).then((res) => {
          res.statusCode.should.equal(200);
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('game');
          res.body[0].should.have.property('inviter_player');
          res.body[0].should.have.property('invited_user');
          res.body[0].inviter_player.should.have.property('id', inviter.id);
          res.body[0].invited_user.should.have.property('id');
          res.body[0].invited_user.should.have.property('from', invites[0]);
          res.body[0].game.should.have.property('id');
          res.body[1].inviter_player.should.have.property('id', inviter.id);
          res.body[1].invited_user.should.have.property('id');
          res.body[1].invited_user.should.have.property('from', invites[1]);
          res.body[1].game.should.have.property('id');
        });
      });

      it('should be able to invite one person successfully and one blacklisted person unsuccessfully', () => {
        const invites = [
          'foo'+Math.random(),
          'foo'+Math.random()
        ];
        return User.create({ from: invites[1] }).then((user) => {
          return User.update(user, { blacklist: 1 });
        }).then(() => {
          return createInvite(inviter.id, invites);
        }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('game');
          res.body[0].should.have.property('inviter_player');
          res.body[0].should.have.property('invited_user');
          res.body[0].inviter_player.should.have.property('id', inviter.id);
          res.body[0].invited_user.should.have.property('id');
          res.body[0].invited_user.should.have.property('from', invites[0]);
          res.body[0].game.should.have.property('id');
          res.body[1].should.have.property('error');
          res.body[1].error.should.contain('User has asked not to be contacted');
          res.body[1].should.have.property('code', 1202);
        });
      });

      it('should be able to invite one person successfully and one already invited person unsuccessfully', () => {
        const invites = [
          'foo'+Math.random(),
          'foo'+Math.random()
        ];
        return createInvite(inviter.id, [ invites[0] ]).then(() => {
          return createInvite(inviter.id, invites);
        }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.length.should.equal(2);
          res.body[0].should.have.property('error');
          res.body[0].error.should.contain('Invite already exists');
          res.body[0].should.have.property('code', 1200);
          res.body[0].should.have.property('error');
          res.body[1].should.have.property('id');
          res.body[1].should.have.property('game');
          res.body[1].should.have.property('inviter_player');
          res.body[1].should.have.property('invited_user');
          res.body[1].inviter_player.should.have.property('id', inviter.id);
          res.body[1].invited_user.should.have.property('id');
          res.body[1].invited_user.should.have.property('from', invites[1]);
          res.body[1].game.should.have.property('id');
        });
      });

      it('should be able to invite one person successfully and one already playing person unsuccessfully', () => {
        const invites = [
          'foo'+Math.random(),
          'foo'+Math.random()
        ];
        return User.create({ from: invites[0] }).then((user) => {
          return Game.add(game, [ user ]);
        }).then((game) => {
          return createInvite(inviter.id, invites);
        }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.length.should.equal(2);
          res.body[0].should.have.property('error');
          res.body[0].error.should.contain('already playing game');
          res.body[0].should.have.property('code', 1203);
          res.body[0].should.have.property('error');
          res.body[1].should.have.property('id');
          res.body[1].should.have.property('game');
          res.body[1].should.have.property('inviter_player');
          res.body[1].should.have.property('invited_user');
          res.body[1].inviter_player.should.have.property('id', inviter.id);
          res.body[1].invited_user.should.have.property('id');
          res.body[1].invited_user.should.have.property('from', invites[1]);
          res.body[1].game.should.have.property('id');
        });
      });

      it('should ignore duplicate invites', () => {
        const invite = 'foo'+Math.random();
        const invites = [
          invite,
          invite
        ];
        return createInvite(inviter.id, invites).then((res) => {
          res.statusCode.should.equal(200);
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('game');
          res.body[0].should.have.property('inviter_player');
          res.body[0].should.have.property('invited_user');
          res.body[0].inviter_player.should.have.property('id', inviter.id);
          res.body[0].invited_user.should.have.property('id');
          res.body[0].invited_user.should.have.property('from', invite);
          res.body[0].game.should.have.property('id');
        });
      });
    });
  });
});
