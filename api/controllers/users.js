'use strict';
const User = require('models/user');

function find(req) {
  return User.find(req.query);
}
function findOne(req) {
  const user_id = req.params.user_id;
  if ( ! user_id ) {
    throw new Error("No user ID provided, how is that possible?");
  } else if ( !parseInt(user_id) ) {
    throw new Error("Invalid user ID provided");
  }
  return User.findOne(user_id);
}

function create(req) {
  return User.create(req.body);
}

const getArgs = (user_id) => {
  if ( /^\d+$/.test(user_id)) {
    return {
      id: user_id,
    };
  }

  return {
    key: user_id,
  };
};

function update(req) {
  const user_id = req.params.user_id;

  const args = getArgs(user_id);

  return User.update(args, req.body).then((response) => {
    return response;
  });
}

function updateFriends(req) {
  const user_id = req.params.user_id;

  const args = getArgs(user_id);

  return User.updateFriends(args, req.body);
}
function remove(req) {
  const user_id = req.params.user_id;
  if ( ! user_id ) {
    throw new Error("No user ID provided, how is that possible?");
  } else if ( !parseInt(user_id) ) {
    throw new Error("Invalid user ID provided");
  }
  return User.remove(user_id);
}

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find
  },
  {
    path: '/',
    method: 'post',
    fn: create
  },
  {
    path: '/:user_id',
    method: 'get',
    fn: findOne
  },
  {
    path: '/:user_id',
    method: 'put',
    fn: update
  },
  {
    path: '/:user_id/friends',
    method: 'put',
    fn: updateFriends
  },
  {
    path: '/:user_id',
    method: 'delete',
    fn: remove
  }

];
