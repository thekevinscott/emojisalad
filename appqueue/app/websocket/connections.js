const users = {};

export function setClient(ws, { userKey }) {
  if (userKey) {
    if (!users[userKey]) {
      users[userKey] = new Map();
      console.info('set up initial map for user key', userKey);
    }

    users[userKey].set(ws, ws);

    ws.on('close', () => {
      console.info('remove websocket for user', userKey);
      users[userKey].delete(ws);
    });
  }
}

export function getClient(userKey) {
  console.info('get the client', userKey, Object.keys(users));
  return users[userKey];
}
