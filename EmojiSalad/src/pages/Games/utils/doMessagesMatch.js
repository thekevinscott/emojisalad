const checkMessageHash = (oldKeys, newKeys) => {
  return oldKeys.filter((oldKey, index) => {
    return oldKey !== newKeys[index];
  });
};

const doMessagesMatch = (oldMessages, newMessages) => {
  const oldKeys = Object.keys(oldMessages);
  const newKeys = Object.keys(newMessages);

  if (oldKeys.length !== newKeys.length) {
    return false;
  }

  return checkMessageHash(oldKeys, newKeys).length === 0;
};

export default doMessagesMatch;
