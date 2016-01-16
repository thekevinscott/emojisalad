'use strict';

module.exports.routes = {
  // users
  'GET /users': 'UserController.find',
  'POST /users': 'UserController.create',

  // players
  'GET /players': 'PlayerController.find',
  'POST /players': 'PlayerController.create',

  'GET /games/:game_id': 'GameController.findOne',
  //'/users/:user_id/games': 'UserController.games',
  'POST /games/:game_id/users': 'GameController.add',
  'DELETE /games/:game_id/users': 'GameController.remove',
  'GET /games/:game_id/rounds': 'GameController.rounds',
  'POST /games/:game_id/rounds': 'GameController.newRound',

};
