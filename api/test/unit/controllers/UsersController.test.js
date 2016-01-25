'use strict';
const request = require('supertest');
const from = 'foo';

describe('UsersController', function() {
  describe('create()', function() {
    describe('Invalid', function() {
      it('should not create a user without a from number', function () {
        return request(sails.hooks.http.app)
          .post('/users')
          .send({ })
          .expect(400, {
            error: `Invalid number provided`
          });
      });

      it('should not be able to create the same user multiple times', function() {
        throw "do it";
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

  describe.only('update()', () => {
    const from = ''+Math.random();
    let user;
    before(function() {
      return User.create({ from: from }).then(function(result) {
        user = {
          id: result.get('id'),
          from: from
        };
      });
    });

    it('should update a user successfully', function(done) {
      const nickname = 'foobar';
      request(sails.hooks.http.app)
        .put(`/users/${user.id}`)
        .send({ nickname: nickname })
        .expect(200)
        .end(function(err, res) {
          return User.findOne({ where: { id: user.id }}).then((found_user) => {
            try {
              found_user.nickname.should.equal(nickname);
            } catch(error) {
              err = error;
            }
            done(err);
          });
        });
    });

    it('should return an accurate user object', function() {
      const nickname = 'barbaz';
      return request(sails.hooks.http.app)
        .put(`/users/${user.id}`)
        .send({ nickname: nickname })
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property('id');
          res.body.should.have.property('from', from);
          res.body.should.have.property('avatar');
          res.body.should.have.property('nickname');
        });
    });
  });
});
