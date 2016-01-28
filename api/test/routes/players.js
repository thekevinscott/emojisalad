const post = require('test/support/request').post;

const Player = require('models/player');
const players = require('routes/players');
let game_number;
describe('Players', function() {
  before(function() {
    game_number = '+15559999999';
  });
  describe('Create', function() {
    describe('Invalid', function() {
      it('should reject a missing from', function() {
        throw 'from';
      });
    });

    describe('Valid', function() {
      it('should create a player', function() {
        const from = 'foo';
        const to = game_number;
        const payload = {
          from: from,
          to: to
        };

        return Player.find().then((players) => {
          const len = players.length;
          return post({
            url: '/players',
            payload: payload
          }).then((res) => {
            //console.log('res', res.error);
            res.statusCode.should.equal(200);
            return Player.find();
          }).then((players) => {
            players.length.should.equal(len + 1);
          });
        });
      });

      it('should respond to create with the player payload', function() {
      });
    });
  });

  describe('Index', function() {
    before(function() {
      return request.post('/players').send({ from: 'foo', to: 'foo' });
    });

    it('should return a list of all players', function(done) {
      return request.get('/players')
      .expect(200)
      .end(function(err, res){
        if ( err ) { done(err); }
        console.log(res.body);
        done();
      });


    });
  });
});
