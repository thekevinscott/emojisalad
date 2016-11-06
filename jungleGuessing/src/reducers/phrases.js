import typeToReducer from 'type-to-reducer';

const phrases = [
  {
    prompt: '👱👱🍄🌟',
    phrase: 'Super Mario Bros',
  },
  {
    prompt: '👧🍄🍵🎩🐰',
    phrase: 'Alice in Wonderland',
  },
  {
    prompt: '👽📞🏠',
    phrase: 'ET',
  },
];

const initialState = phrases;

export default typeToReducer({
}, initialState);
