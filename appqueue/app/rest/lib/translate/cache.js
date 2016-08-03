const cache = {
  incoming: {},
  outgoing: {},
};

function getCache(type, namespace, key) {
  return null;
  if (cache[namespace] && cache[namespace][key]) {
    return cache[namespace][key];
  }

  return null;
}

function setCache(type, namespace, key, payload) {
  if (!cache[type][namespace]) {
    cache[type][namespace] = {};
  }
  cache[type][namespace][key] = payload;
  return payload;
}


export function getOutgoingCache(userKey, gameKey) {
  return getCache('outgoing', userKey, gameKey);
}

export function setOutgoingCache(userKey, gameKey, payload) {
  return setCache('outgoing', userKey, gameKey, payload);
}

export function getIncomingCache(phoneNumber, senderId) {
  return getCache('outgoing', phoneNumber, senderId);
}

export function setIncomingCache(phoneNumber, senderId, payload) {
  return setCache('incoming', phoneNumber, senderId, payload);
}
