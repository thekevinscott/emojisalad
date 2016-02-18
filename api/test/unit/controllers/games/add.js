const post = require('test/support/request').post;

const User = require('models/user');
//const Player = require('models/player');
const Game = require('models/game');
//const game_number = '+15559999999';

describe('Add', function() {
  let game;
  let user;
  let from = 'foo' + Math.random();
  before(() => {
    return User.create({ from: from }).then((res) => {
      user = res;
      return Game.create([{ id: user.id }]);
    }).then((res) => {
      game = res;
    });
  });

  it('should reject if not provided a user', () => {
    return post({
      url: `/games/${game.id}/players`,
      data: { }
    }).then((res) => {
      res.statusCode.should.equal(400);
      res.error.text.should.contain('You must provide an array of users');
    });
  });

  it('should reject if provided an invalid game id', () => {
    return post({
      url: `/games/foo/players`,
      data: []
    }).then((res) => {
      res.statusCode.should.equal(400);
      res.error.text.should.contain('Invalid game ID provided');
    });
  });

  it('should return the game with an empty array', () => {
    return post({
      url: `/games/${game.id}/players`,
      data: { users: [] }
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id');
      res.body.should.have.property('players');
    });
  });

  it('should return a game without a particular user if user does not exist', () => {
    return post({
      url: `/games/${game.id}/players`,
      data: { users: [{ id: 99999, from: 'foo' }] }
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id');
      res.body.should.have.property('players');
      res.body.players.length.should.equal(1);
    });
  });

  it('should add a user to a game', () => {
    const from = 'foo' + Math.random();
    const from2 = 'foo' + Math.random();

    return User.create({ from: from }).then((res) => {
      return Game.create([{ id: res.id }]).then((game) => {
        return User.create({ from: from2 }).then((new_user) => {
          return post({
            url: `/games/${game.id}/players`,
            data: { users: [ new_user ] }
          }).then((res) => {
            res.statusCode.should.equal(200);
            res.body.should.have.property('id');
            res.body.should.have.property('players');
            res.body.should.have.property('round');
            res.body.should.have.property('round_count', 0);
            res.body.players.length.should.equal(2);
            res.body.players[0].should.have.property('from', from);
            res.body.players[1].should.have.property('from', from2);
          });
        });
      });
    });
  });

  it('should add multiple users to a game', () => {
    const from = 'foo' + Math.random();
    const from2 = 'foo' + Math.random();
    const from3 = 'foo' + Math.random();

    return User.create({ from: from }).then((res) => {
      return Game.create([{ id: res.id }]).then((game) => {
        return Promise.all([
          User.create({ from: from2 }),
          User.create({ from: from3 })
        ]).then((users) => {
          return post({
            url: `/games/${game.id}/players`,
            data: { users: users }
          }).then((res) => {
            res.statusCode.should.equal(200);
            res.body.should.have.property('id');
            res.body.should.have.property('players');
            res.body.players.length.should.equal(3);
            res.body.players[0].should.have.property('from', from);
            res.body.players[1].should.have.property('from', from2);
            res.body.players[2].should.have.property('from', from3);
          });
        });
      });
    });
  });

  it('should add one valid user and not an invalid user', () => {
    const from = 'foo' + Math.random();
    const from2 = 'foo' + Math.random();

    return User.create({ from: from }).then((res) => {
      return Game.create([{ id: res.id }]).then((game) => {
        return User.create({ from: from2 }).then((user) => {
          return post({
            url: `/games/${game.id}/players`,
            data: { users: [ user, { id: 99999 } ] }
          }).then((res) => {
            res.statusCode.should.equal(200);
            res.body.should.have.property('id');
            res.body.should.have.property('players');
            res.body.players.length.should.equal(2);
            res.body.players[0].should.have.property('from', from);
            res.body.players[1].should.have.property('from', from2);
          });
        });
      });
    });
  });

  //it('should start a game if two or more players are added to a new game and no round exists', () => {
    //const from = 'foo' + Math.random();
    //const from2 = 'foo' + Math.random();

    //return User.create({ from: from }).then((res) => {
      //return Game.create([{ id: res.id }]).then((game) => {
        //return Promise.all([
          //User.create({ from: from2 }),
        //]).then((users) => {
          //return post({
            //url: `/games/${game.id}/players`,
            //data: { users: users }
          //}).then((res) => {
            //res.statusCode.should.equal(200);
            //res.body.should.have.property('round_count', 1);
            //res.body.should.have.property('round');
            //res.body.round.should.have.property('id');
            //res.body.round.should.have.property('phrase');
            //res.body.round.should.have.property('submitter');
            //res.body.round.should.have.property('players');
          //});
        //});
      //});
    //});
  //});

  //it('should not add a new round if one already exists', () => {
    //const from = 'foo' + Math.random();
    //const from2 = 'foo' + Math.random();
    //const from3 = 'foo' + Math.random();

    //return User.create({ from: from }).then((res) => {
      //return Game.create([{ id: res.id }]).then((game) => {
        //return Promise.all([
          //User.create({ from: from2 }),
          //User.create({ from: from3 })
        //]).then((users) => {
          //return post({
            //url: `/games/${game.id}/players`,
            //data: { users: [users[0]] }
          //}).then((res) => {
            //const round_id = res.body.round.id;

            //return post({
              //url: `/games/${game.id}/players`,
              //data: { users: [users[1]] }
            //}).then((res) => {
              //res.statusCode.should.equal(200);
              //res.body.should.have.property('id');
              //res.body.should.have.property('players');
              //res.body.players.length.should.equal(3);
              //res.body.players[0].should.have.property('from', from);
              //res.body.players[1].should.have.property('from', from2);
              //res.body.players[2].should.have.property('from', from3);
              //res.body.round.should.have.property('id', round_id);
            //});
          //});
        //});
      //});
    //});
  //});
});
