const clients = {};

function parseMessage(message) {
  try {
    return JSON.parse(message);
  } catch (err) {
    return {};
  }
}

export function setClient(ws, message) {
  const {
    userKey,
  } = parseMessage(message);
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
