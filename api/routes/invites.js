'use strict';
const Invite = require('models/invite');
const _ = require('lodash');

module.exports = [
  {
    path: '/:game_id/invite',
    method: 'post',
    fn: create
  },
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
  return Invite.create(req.body);
}
function find() {
  return Invite.find();
}

module.exports.create = create;
module.exports.find = find;
//module.exports.findOne = findOne;
