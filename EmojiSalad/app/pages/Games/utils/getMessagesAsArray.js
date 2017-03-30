const getMessagesAsArray = messages => {
  const messageIndices = Object.keys(messages).map(key => parseInt(key, 10)).sort();
  return messageIndices.map(index => messages[index]);
};

export default getMessagesAsArray;
