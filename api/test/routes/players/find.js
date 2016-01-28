const post = require('test/support/request').post;

const Player = require('models/player');
const players = require('routes/players');
let game_number;
describe('Index', function() {
  before(function() {
    game_number = '+15559999999';
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
