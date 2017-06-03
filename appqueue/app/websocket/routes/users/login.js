import createUser from '../../users/createUser';
import fetchUserFriends from '../../users/fetchUserFriends';

export default function login(ws, payload) {
  //const text = payload.text;
  console.info('login with payload', payload);
  const {
    data,
  } = payload;

  return createUser(data).then(user => {
    // kick off a population of a user's friends
    fetchUserFriends(ws, user);
    // return the user in the meantime so they don't
    // have to wait.
    return user;
  });
}
