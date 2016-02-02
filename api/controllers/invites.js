'use strict';
const Invite = require('models/invite');
const _ = require('lodash');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
  {
    path: '/:invite_id',
    method: 'get',
    fn: findOne
  }
];

function create(req) {
  const inviter_id = req.body.inviter_id;
  if ( ! inviter_id ) {
    throw "You must provide an inviter_id";
  } else if ( !parseInt(inviter_id) ) {
    throw "You must provide a valid inviter_id";
  }

  if ( ! req.body.invites ) {
    throw "You must provide a valid invites";
  } else if ( !_.isArray(req.body.invites) ) {
    throw "You must provide valid invites";
  }

  req.body.invites = _.uniq(req.body.invites);
  return Invite.create(req.body);
}
function find(req) {
  return Invite.find(req.query);
}
function findOne(req) {
  const invite_id = req.params.invite_id;
  if ( ! invite_id ) {
    throw "No invite ID provided, how is that possible?";
  } else if ( !parseInt(invite_id) ) {
    throw "Invalid invite ID provided";
  }
  return Invite.findOne(invite_id);
}
function use(req) {
  return Invite.use(req.params.invite_id);
}

module.exports.create = {
  path: '/:game_id/invite',
  method: 'post',
  fn: create
};
module.exports.use = {
  path: '/:game_id/invites/:invite_id/use',
  method: 'post',
  fn: use 
};
module.exports.find = {
  path: '/:game_id/invites',
  method: 'get',
  fn: find 
};

