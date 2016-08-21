const clients = {};

export function setClient(ws, { userKey }) {
  if (userKey && !clients[userKey]) {
    clients[userKey] = ws;

    ws.on('close', () => {
      clients[userKey] = null;
    });
  }
}

export function getClient(userKey) {
  return clients[userKey];
}
