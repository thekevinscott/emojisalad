var should = require('chai').should();
var sinon = require('sinon');
var mockrequire = require('mockrequire');

var methods = mockrequire('../../scripts/methods/index', {
  'request-promise' : {
    then: function() {},
    catch: function() {}
  }
});


describe('Script methods', function() {
  it('should have respond and request methods', function() {
    methods.respond.should.exist;
    methods.request.should.exist;
  });

  describe('Respond', function() {
    var User = require('../../models/user');
    var respond = methods.respond;

    it('should require an action message and a user', function() {
      var stub = sinon.stub(User, 'message');
      (function() {
        respond();
      }).should.throw(Error);
      (function() {
        respond({});
      }).should.throw(Error);
      (function() {
        respond({ message_key: 'intro-1' });
      }).should.throw(Error);
      (function() {
        respond({ message_key: 'intro-1'}, 'foo' );
      }).should.throw(Error);
      (function() {
        respond({ message_key: 'intro-1', options: 'foo'}, {id: 1} );
      }).should.throw(Error);
      (function() {
        respond({ message_key: 'intro-1' }, {id: 1} );
      }).should.not.throw(Error);
      stub.restore();
    });

    it('should correctly pass user and message to User.message', function() {
      var key = 'foo';
      var stub = sinon.stub(User, 'message', function(user, message_key) {
        user.should.deep.equal({ id : 1 });
        message_key.should.equal(key);
      });

      respond({ message_key: key }, { id : 1 });

      stub.restore();
    });

    it('should initialize options to an empty array', function() {
      var stub = sinon.stub(User, 'message', function(user, message_key, options) {
        options.should.deep.equal([]);
      });

      respond({ message_key: 'foo' }, { id : 1 });

      stub.restore();
    });

    it('should initialize options with variables if scenario specifies them', function() {
      var myOptions = [ 'foo' ];
      var text = 'Here comes my text';
      var stub = sinon.stub(User, 'message', function(user, message_key, options) {
        options.should.deep.equal( [text] );
      });

      var scenario = {
        message_key: 'foo',
        options: [ '%(message)s' ]
      };

      respond(scenario, { id : 1 }, text);

      stub.restore();
    });
  });

  describe('Request', function() {
    var User = require('../../models/user');
    var request = methods.request;

    it('should require a valid scenario url and a user', function() {
      var user_stub = sinon.stub(User, 'message');

      (function() {
        request();
      }).should.throw(Error);
      (function() {
        request({});
      }).should.throw(Error);
      (function() {
        request({ url: 'intro-1' });
      }).should.throw(Error);
      (function() {
        request({ url: 'intro-1'}, 'foo' );
      }).should.throw(Error);
      (function() {
        request({ url: '/intro-1' }, {id: 1} );
      }).should.not.throw(Error);
    });

    it.only('should make a correct request', function() {
      request({ url: '/foo' }, { id : 1 });
    });

    it('should initialize options to an empty array', function() {
      var stub = sinon.stub(User, 'message', function(user, message_key, options) {
        options.should.deep.equal([]);
      });

      request({ message_key: 'foo' }, { id : 1 });

      stub.restore();
    });

    it('should initialize options with variables if scenario specifies them', function() {
      var myOptions = [ 'foo' ];
      var text = 'Here comes my text';
      var stub = sinon.stub(User, 'message', function(user, message_key, options) {
        options.should.deep.equal( [text] );
      });

      var scenario = {
        message_key: 'foo',
        options: [ '%(message)s' ]
      };

      request(scenario, { id : 1 }, text);

      stub.restore();
    });
  });
});
