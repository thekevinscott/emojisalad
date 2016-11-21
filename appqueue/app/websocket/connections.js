const clients = {};

export function setClient(ws, { userKey }) {
  if (userKey && !clients[userKey]) {
    console.info('attached client', userKey);
    clients[userKey] = ws;

    ws.on('close', () => {
      console.info('close the client', userKey);
      clients[userKey] = null;
    });
  }
}

export function getClient(userKey) {
  console.info('get the client', userKey, Object.keys(clients).map(clientKey => {
    return {
      key: clientKey,
      exists: !!clients[clientKey],
    };
  }));
  return clients[userKey];
}
