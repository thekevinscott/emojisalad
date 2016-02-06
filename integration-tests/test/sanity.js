const http = require('http');

const services = require('../config/services');
const api_port = services.api.port;
const bot_port = services.bot.port;
const test_port = services.testqueue.port;

function req(options, callback, error) {
  http.get(options, function(res) {
    let body;
    res.on("data", function(chunk) {
      body = chunk;
      try {
        body = JSON.parse(body);
      } catch(err) {}
    });

    res.on("end", () => {
      callback(body, res);
    });
  }).on('error', function(e) {
    //console.log("Got error: " + e.message);
    error(e.message);
  });
}

describe('Testing Servers', function() {
  it('should check testqueue', function(done) {
    const port = test_port;
    req({
      host: `localhost`,
      port: port,
      path: `/received`
    }, (body) => {
      body.length.should.equal(5);
      done();
    }, done);
  });

  it('should check api', function(done) {
    const port = api_port;
    req({
      host: `localhost`,
      port: port,
      path: `/users`
    }, (body) => {
      body.should.deep.equal([]);
      body.length.should.equal(0);
      done();
    }, done);
  });

  it('should check bot', function(done) {
    const port = bot_port;
    req({
      host: `localhost`,
      port: port,
      path: `/ping`
    }, (body, res) => {
      res.statusCode.should.equal(200);
      done();
    }, done);
  });

  it.only('should get a valid response', (done) => {
    const setup = require('lib/setup');
    const getPlayers = require('lib/getPlayers');
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello?' },
      { player: player, msg: 'hello? 2' },
    ]).then(function(obj) {
      console.log('obj', obj);
      obj.output.should.deep.equal(obj.expected);
    });
  });
});
