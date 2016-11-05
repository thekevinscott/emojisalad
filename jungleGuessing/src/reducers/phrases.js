import typeToReducer from 'type-to-reducer';

const phrases = [
  {
    prompt: '👱👱🍄🌟',
    phrase: 'Super Mario Bros',
  },
];

const initialState = phrases;

export default typeToReducer({
}, initialState);
