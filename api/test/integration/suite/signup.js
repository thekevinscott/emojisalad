var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var setup = require('../lib/setup');
var check = require('../lib/check');

describe('Signup', function() {

  describe('Test a brand new user', function() {
    it('should introduce itself when contacting for the first time', function() {
      var user = getUsers(1)[0];
      return check(
        { user: user, msg: 'hello?' },
        [
          { key: 'intro', to: user }
        ]
      );
    });

    describe('Saying yes', function() {
      function reachOut() {
        var user = getUsers(1)[0];
        return setup([
          { user: user, msg: 'hi' }
        ]).then(function() {
          return user;
        });
      }

      function sayYes(message) {
        return reachOut().then(function(user) {
          return check(
            { user: user, msg: message },
            [{ key: 'intro_2', to: user }]
          );
        });
      }

      it('should start the onboarding with a "yes" response', function() {
        return sayYes('yes').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a case sensitive "Yes" response', function() {
        return sayYes('Yes').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "y" response', function() {
        return sayYes('y').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "yea" response', function() {
        return sayYes('yea').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "yeah" response', function() {
        return sayYes('yeah').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "yeehaw" response', function() {
        return reachOut().then(function(user) {
          return check(
            { user: user, msg: 'yeehaw' },
            []
          );
        }).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  it('should prompt the user to invite friends', function() {
    var user = getUsers(1)[0];
    return setup([
      { user: user, msg: 'hello' },
      { user: user, msg: 'y' },
    ]).then(function() {
      return check(
        { user: user, msg: user.nickname },
        [
          { key: 'intro_3', options: [ user.nickname ], to: user }
        ]
      ).then(function(obj) {
      console.log('5');
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should blacklist a new user who messages accidentally', function() {
    var user = getUsers(1)[0];
    return setup([
      { user: user, msg: 'hello' },
      { user: user, msg: 'no' },
    ]).then(function() {
      return check(
        { user: user, msg: 'any response?' },
        [ ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide a user who tries to invite users before entering a nickname', function() {
    var user = getUsers(1)[0];
    return setup([
      { user: user, msg: 'hello' },
      { user: user, msg: 'yes' },
    ]).then(function() {
      return check(
        { user: user, msg: 'invite foo' },
        [{ key: 'wait-to-invite', to: user }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
});
