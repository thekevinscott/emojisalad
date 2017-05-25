import createUser from '../../users/createUser';

export default function login(ws, payload) {
  //const text = payload.text;
  console.info('login with payload', payload);
  const {
    data: {
      credentials: {
        //tokenExpirationDate,
        //permissions,
        userId,
        token,
      },
    },
  } = payload;

  return createUser({ userId, token });
}
