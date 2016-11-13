import doMessagesMatch from './doMessagesMatch';

const messagesHaveLayouts = (propMessages, stateMessages) => {
  const l = propMessages.filter(({ key }) => {
    return stateMessages[key];
  }).length;
  return l === propMessages.length;
};

const messagesShouldAnimate = ({ prev, current }, messages) => {
  const messagesMatch = doMessagesMatch(prev.messages, current.messages);

  if (messagesMatch) {
    return false;
  }

  return messagesHaveLayouts(current.messages, messages);
};

export default messagesShouldAnimate;
