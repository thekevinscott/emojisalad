import {
  WHITELISTED_REDUCERS,
} from './';

function getComponentStatePart(state, topKey) {
  const reducers = WHITELISTED_REDUCERS[topKey];
  // topKey is a top level key on the store, so either ui or data
  return reducers.reduce((obj, key) => ({
    ...obj,
    [key]: state[topKey][key],
    //[key]: (key === 'games') ?
      //Object.keys(state[topKey][key]).reduce((gameObj, gameKey) => {
        //const game = state[topKey][key][gameKey];
        //const messages = game.messages;
        //const msgLength = messages.length;
        //const payload = {
          //...game,
          //messages: [messages[msgLength - 1]],
        //};
        //return {
          //...gameObj,
          //[gameKey]: payload,
        //};
      //}, {})
      //:
      //state[topKey][key],
  }), {});
}

export default function getStateParts(state) {
  const statePart = Object.keys(WHITELISTED_REDUCERS).reduce((obj, key) => ({
    ...obj,
    [key]: getComponentStatePart(state, key),
  }), {});
  return JSON.stringify(statePart);
}
