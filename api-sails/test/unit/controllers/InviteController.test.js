'use strict';
const request = require('supertest');
let game_number;
let game_number_id;
const default_state = 'waiting-for-confirmation';
const chai = require('chai');
const expect = chai.expect;

describe('InviteController', function() {
  before(function() {
    return GameNumber.findOne().then(function(result) {
      game_number = result.number;
      game_number_id = result.id;
    });
  });

  describe('create()', function() {
    describe('Invalid', function() {
      it('should not create an invite without an inviter number', function () {
        return request(sails.hooks.http.app)
          .post('/invites')
          .send({ })
          .expect(400, {
            error: `Invalid inviter`
          });
      });

      it('should not create an invite without an invited number', function () {
        return request(sails.hooks.http.app)
          .post('/invites')
          .send({ inviter_id: 'foo' })
          .expect(400, {
            error: `Invalid invited`
          });
      });

      it('should not create an invite with an invalid inviter', function () {
        const inviter = 'foo';
        return request(sails.hooks.http.app)
          .post('/invites')
          .send({ inviter_id: inviter, invited: 'foo' })
          .expect(400, {
            error: `Invalid inviter: ${inviter}`
          });
      });
    });

    describe('Valid', function() {
      const invited = Math.random();
      const inviter = Math.random();
      let invited_user_id;
      let inviter_id;
      before(function(done) {
        return User.create({ from: inviter }).then((user) => {
          return Player.createPlayer({ to: game_number, from: inviter, state: default_state });
        }).then((player) => {
          inviter_id = player.id;
          return User.create({ from: invited });
        //}).then((user) => {
          //return Player.create({ to: 'foo', user_id: user.id });
        }).then((user) => {
          invited_user_id = user.id;
          done();
        });
      });

      it('should create an invite', function (done) {
        request(sails.hooks.http.app)
          .post(`/invites/`)
          .send({ inviter_id: inviter_id, invited: invited })
          .expect(200)
          .end(function(err, res) {
            const invite_params = {
              inviter_id: inviter_id,
              //invited_id: invited_id
            };
            return Invite.findOne({ where: invite_params }).then((found_invite) => {
              expect(found_invite).to.be.ok;
              expect(found_invite.id).to.be.ok;
              done(err);
            });
          });
      });

      it.only('should return a correctly formatted invite', function () {
        return request(sails.hooks.http.app)
          .post('/invites')
          .send({ inviter_id: inviter_id, invited: invited})
          .expect(200)
          .expect(function(res) {
            res.body.should.have.property('id');
            res.body.should.have.property('inviter');
            res.body.should.have.property('invited');
            res.body.inviter.should.have.property('id', inviter_id);
            res.body.invited.should.have.property('user_id', invited_user_id);
            res.body.inviter.should.have.property('state');
            res.body.invited.should.have.property('state');
            res.body.should.have.property('used', false);
          });
      });
    });

  });

  describe('use()', () => {
    it('huh', () => {
      throw '123';
    });
  });

  describe('find', () => {
    const invited = Math.random();
    const inviter = Math.random();
    let invited_user_id;
    let inviter_id;
    before(function(done) {
      return User.create({ from: inviter }).then((user) => {
        return Player.create({ to: 'foo', user_id: user.id });
      }).then((player) => {
        inviter_id = player.id;
      //}).then(() => {
        return User.create({ from: invited });
      }).then((user) => {
        //return Player.create({ to: 'foo', user_id: user.id });
      //}).then((player) => {
        invited_user_id = user.id;
        return request(sails.hooks.http.app)
          .post('/invites')
          .send({ inviter_id: inviter_id, invited: invited });
      }).then(() => {
        done();
      });
    });

    //it('should find a list of used invites', () => {
      //throw 'do it';
    //});

    //it('should find a list of invites', () => {
      //return request(sails.hooks.http.app)
        //.get('/invites')
        //.expect(200)
        //.expect(function(res) {
          //res.body.length.should.be.above(0);
          //res.body[0].should.have.property('id');
        //})
    //});

    it('should find an invite', () => {
      return request(sails.hooks.http.app)
        .get('/invites')
        .query({
          inviter_id: inviter_id,
          //invited_id: invited_id,
        })
        .expect(200)
        .expect(function(res) {
          //res.body.length.should.be.above(0);
          const invite = res.body;
          invite.should.have.property('id');
          invite.should.have.property('inviter');
          invite.should.have.property('invited');
          invite.inviter.should.have.property('id', inviter_id);
          invite.invited.should.have.property('user_id', invited_user_id);
          invite.inviter.should.have.property('state');
          invite.invited.should.have.property('state');
          invite.should.have.property('used', false);
        });
    });
  });
});
