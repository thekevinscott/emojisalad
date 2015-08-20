var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

var request = require('../../../scripts/methods/request');
var respond = require('../../../scripts/methods/respond');
var User = require('../../../models/user');

describe('Script methods', function() {
  it('should have respond and request methods', function() {
    respond.should.exist;
    request.should.exist;
  });

  describe('Respond', function() {

    it('should require an action message and a user', function() {
      var stub = sinon.stub(User, 'message');
      (function() {
        respond();
      }).should.throw(Error);
      (function() {
        respond({});
      }).should.throw(Error);
      (function() {
        respond({ message: 'intro-1' });
      }).should.throw(Error);
      (function() {
        respond({ message: 'intro-1'}, 'foo' );
      }).should.throw(Error);
      (function() {
        respond({ message: 'intro-1', options: 'foo'}, {id: 1} );
      }).should.throw(Error);
      (function() {
        respond({ message: 'intro-1' }, {id: 1} );
      }).should.not.throw(Error);
      stub.restore();
    });

    it('should correctly pass user and message to User.message', function() {
      var key = 'foo';
      var stub = sinon.stub(User, 'message', function(user, message) {
        user.should.deep.equal({ id : 1 });
        message.should.equal(key);

        stub.restore();
      });

      return respond({ message: key }, { id : 1 });
    });

    it('should initialize options to an empty array', function() {
      var stub = sinon.stub(User, 'message', function(user, message, options) {
        options.should.deep.equal([]);
        stub.restore();
      });

      return respond({ message: 'foo' }, { id : 1 });
    });

    it('should initialize options with variables if scenario specifies them', function() {
      var myOptions = [ 'foo' ];
      var text = 'Dolly';
      var stub = sinon.stub(User, 'message', function(user, message, options) {
        options.should.deep.equal( [text] );
        stub.restore();
      });

      var scenario = {
        message: 'foo',
        options: [ '%(message)s' ]
      };

      return respond(scenario, { id : 1 }, text);
    });
  });

  describe('Request', function() {
    var requestPromise = require('request-promise');
    var rp_stub;
    // define callbacks here;
    var rp;

    beforeEach(function() {
      rp = function() {};

      try { 
        rp_stub = sinon.stub(requestPromise, 'call', function(self, opts) {
          return new Promise(function(resolve) {
            try {
            resolve(rp(opts));
            } catch(e) { reject(e); }
          });
        });
      // this means its already stubbed
      } catch(e) {}
    });

    afterEach(function() {
      if ( rp_stub ) {
        rp_stub.restore();
      }
    });

    it('should require a valid scenario url and a user', function() {
      var user_stub = sinon.stub(User, 'message');

      (function() {
        request();
      }).should.throw(Error);
      (function() {
        request({});
      }).should.throw(Error);
      (function() {
        request({ url: '/intro-1'}, 'foo' );
      }).should.throw(Error);
      (function() {
        request({ url: '/intro-1' }, {id: 1} );
      }).should.not.throw(Error);
    });

    describe('URL parsing', function() {
      it('should prepend host to a URL that misses it', function() {
        var url = 'foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal('http://localhost:5000/'+url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, { id : 1 });
      });

      it('should prepend host to a URL that misses it but has a starting slash', function() {
        var url = '/foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal('http://localhost:5000'+url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, { id : 1 });
      });

      it('should not prepend host if it already exists on an http url', function() {
        var url = 'http://www.google.com/foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal(url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, { id : 1 });
      });

      it('should not prepend host if it already exists on an https url', function() {
        var url = 'https://www.google.com/foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal(url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, { id : 1 });
      });

      it('should parse the URL correctly based on parameters', function() {
        var url = '/foo/%(message)s/%(user.id)s';
        var user_id = 1;

        var scenario = {
          url: url,
          data: {},
        };
        var user = { id : user_id };

        var message = 'HELLO';

        rp = function(opts) {
          opts.url.should.exist;
          opts.url.should.equal('http://localhost:5000/foo/'+message+'/'+user_id);
        }

        return request(scenario, user, message);
      });
    });

    describe('parsing string responses', function() {
      var url = '/foo';
      var json = {};
      var scenario = {
        url: url,
        data: json,
      };
      var user = { id : 1 };

      it('should parse JSON', function() {
        rp = function() {
          return {
            foo: 'foo'
          }
        }

        return request(scenario, user).then(function(response) {
          response.foo.should.exist;
        });
      });

      it('should parse a string\'d JSON object', function() {
        rp = function() {
          return JSON.stringify({
            foo: 'foo'
          });
        };

        return request(scenario, user).then(function(response) {
          response.foo.should.exist;
        });
      });

      it('should throw an error with invalid json', function() {

        // return invalid json
        rp = function() {
          return 'foo';
        };

        return request(scenario, user).catch(function(e) {
          e.should.exist;
        });
      });
    });


  });
});
