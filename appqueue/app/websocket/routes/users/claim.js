import parsePhone from '../../phones/parsePhone';
import getUsers from '../../users/getUsers';
import updateUser from '../../users/updateUser';

export default function claim(ws, payload) {
  const text = payload.text;
  //const device = payload.device;
  //console.info('claim', text, device);

  return parsePhone(text).then(phone => {
    console.info('phone parsed', phone);
    if (!phone) {
      throw new Error('Invalid phone number');
    }

    return getUsers({ from: phone }).then(users => {
      console.info('users got', users);
      if (users.length === 0) {
        throw new Error(`No users found for ${text}`);
      }
      return users.slice(0, 1);
    }).then(user => {
      console.info('now, upadte users');
      updateUser(ws, user, {
        //device,
        phone,
      });
      console.info('return user', user);
      return user;
    });
  });
}
