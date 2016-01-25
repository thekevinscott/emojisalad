'use strict';

module.exports.routes = {
  // users
  'GET /users': 'UserController.find',
  'POST /users': 'UserController.create',
  'PUT /users/:user_id': 'UserController.update',

  // players
  'GET /players': 'PlayerController.find',
  'POST /players': 'PlayerController.create',
  'PUT /players/:player_id': 'PlayerController.update',

  // invites
  'GET /invites': 'InviteController.find',
  'POST /invites': 'InviteController.create',
  'PUT /invites/:id': 'InviteController.use',

  'GET /games/:game_id': 'GameController.findOne',
  //'/users/:user_id/games': 'UserController.games',
  'POST /games/:game_id/users': 'GameController.add',
  'DELETE /games/:game_id/users': 'GameController.remove',
  'GET /games/:game_id/rounds': 'GameController.rounds',
  'POST /games/:game_id/rounds': 'GameController.newRound',

};
