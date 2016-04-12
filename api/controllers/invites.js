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
  console.info('req body', req.body);
  if ( ! inviter_id ) {
    throw new Error("You must provide an inviter_id");
  } else if ( !parseInt(inviter_id) ) {
    throw new Error("You must provide a valid inviter_id");
  }

  if ( ! req.body.invitee ) {
    throw new Error("You must provide a valid invitee");
  //} else if ( !_.isArray(req.body.invitee) ) {
    //throw new Error("You must provide valid invitee");
  }

  //req.body.invitee = _.uniq(req.body.invitee);
  return Invite.create(req.body);
}
function find(req) {
  return Invite.find(req.query);
}
function findOne(req) {
  const invite_id = req.params.invite_id;
  if ( ! invite_id ) {
    throw new Error("No invite ID provided, how is that possible?");
  } else if ( !parseInt(invite_id) ) {
    throw new Error("Invalid invite ID provided");
  }
  return Invite.findOne(invite_id);
}
function use(req) {
  console.info('Invite use controller');
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
