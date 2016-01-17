'use strict';
const request = require('supertest');
const from = 'foo';

describe('UsersController', function() {
  describe('create()', function() {
    describe('Invalid', function() {
      it('should not create a player without a from number', function () {
        return request(sails.hooks.http.app)
          .post('/users')
          .send({ })
          .expect(400, {
            error: `Invalid number provided`
          });
      });
    });

    describe('Valid', function() {
      it('should return a valid user object on create', function() {
        let default_state = 'waiting-for-confirmation';
        return request(sails.hooks.http.app)
          .post('/users')
          .send({ from: from })
          .expect(200)
          .expect(function(res) {
            res.body.should.have.property('id');
            res.body.should.have.property('from', from);
          })
      });

      it('should return a user with a default avatar', function() {
        return request(sails.hooks.http.app)
          .post('/users')
          .send({ from: from })
          .expect(200)
          .expect(function(res) {
            res.body.should.have.property('avatar');
          })
      });

    });

  });
});
