const getMessageKeys = props => {
  return Object.keys(props).map(key => props[key]);
};

const getTargetHeight = (props, messages) => {
  const targetHeight = getMessageKeys(props).slice(0, -1).reduce((val, message) => {
    return val - messages[message.key].layout.height;
  }, 0);
  return targetHeight;
};

export default getTargetHeight;
