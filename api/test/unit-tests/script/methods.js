var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');
var _ = require('lodash');

var request = require('../../../scripts/methods/request');
var respond = require('../../../scripts/methods/respond');
var User = require('../../../models/user');
var Message = require('../../../models/message');

var host = 'http://localhost:'+process.env.PORT;

describe('Script methods', function() {
  var user = { id: 1 };

  it('should have respond and request methods', function() {
    respond.should.exist;
    request.should.exist;
  });

  describe('Respond', function() {
    var data = {
      args: [
        { user: user }
      ]
    };

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
        respond({ message: 'intro-1', options: 'foo'}, data );
      }).should.throw(Error);
      (function() {
        respond({ message: 'intro-1' }, data );
      }).should.not.throw(Error);
      stub.restore();
    });

    it('should correctly pass user and message to User.message', function() {
      var key = 'foo';
      var stub = sinon.stub(Message, 'get', function(message) {
        message.should.equal(key);

        stub.restore();
      });

      return respond({ message: key }, data );
    });

    it('should initialize options to an empty array', function() {
      var stub = sinon.stub(Message, 'get', function(message, options) {
        options.should.deep.equal([]);
        stub.restore();
      });

      return respond({ message: 'foo' }, data);
    });

    it('should initialize options with variables if scenario specifies them', function() {
      var myOptions = [ 'foo' ];
      var text = 'Dolly';
      var stub = sinon.stub(Message, 'get', function(message, options) {
        options.should.deep.equal( [text] );
        stub.restore();
      });

      var scenario = {
        message: 'foo',
        options: [ '%(message)s' ]
      };

      return respond(scenario, _.assign({}, data, { message: text }));
    });
  });

  describe('Request', function() {
    var data = {
      args: [
        { user: user }
      ]
    };
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
        request({ url: '/intro-1' }, data );
      }).should.not.throw(Error);
    });

    describe('URL parsing', function() {
      it('should prepend host to a URL that misses it', function() {
        var url = 'foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal(host+'/'+url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, data);
      });

      it('should prepend host to a URL that misses it but has a starting slash', function() {
        var url = '/foo';
        var method = 'PUT';
        var json = { foo: 'bar' };

        rp = function(opts) {
          opts.url.should.equal(host+url);
          opts.method.should.equal(method);
          opts.json.should.equal(json);
        }

        return request({ url: url, data: json, method: method }, data);
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

        return request({ url: url, data: json, method: method }, data);
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

        return request({ url: url, data: json, method: method }, data);
      });

      it('should parse the URL correctly based on parameters', function() {
        var url = '/foo/%(args[0].message)s/%(args[0].user.id)s';
        var user_id = 1;

        var scenario = {
          url: url,
          data: {},
        };
        var user = { id : user_id };

        var message = 'HELLO';

        rp = function(opts) {
          opts.url.should.exist;
          opts.url.should.equal(host+'/foo/'+message+'/'+user_id);
        }

        var testData = _.assign({}, data);
        testData.args[0].message = message;
        return request(scenario, testData);
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

        return request(scenario, data).then(function(response) {
          response.foo.should.exist;
        });
      });

      it('should parse a string\'d JSON object', function() {
        rp = function() {
          return JSON.stringify({
            foo: 'foo'
          });
        };

        return request(scenario, data).then(function(response) {
          response.foo.should.exist;
        });
      });

      it('should throw an error with invalid json', function() {

        // return invalid json
        rp = function() {
          return 'foo';
        };

        return request(scenario, data).catch(function(e) {
          e.should.exist;
        });
      });
    });


  });
});
