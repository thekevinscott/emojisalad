import typeToReducer from 'type-to-reducer';

import {
  GO_TO_NEXT_PHRASE,
  FETCH_GUESSES,
} from '../components/App/types';

import {
  RECEIVED_MESSAGE,
} from '../store/middleware/websocket/types';

const phrases = [
  {
    prompt: '🎮 😡🐧🐦🐤',
    phrase: 'Angry Birds',
  },
  {
    prompt: '🌪👠🐶     🛣     🙀💭🤖❤️🦁😨     🗿👴       ✈️🐵🐵🐵🐵🐵👺',
    phrase: 'Wizard of Oz',
  },
  {
    prompt: '🎬 ⭐️⚔  🛰  ◾️💀◾️',
    phrase: 'Star Wars',
  },
  {
    prompt: '🎤 🚫✋🙏',
    phrase: 'Don\'t Stop Believing',
  },
  {
    prompt: '👑⚔👁💍🔥',
    phrase: 'Lord of the Rings',
  },
  {
    prompt: '📽👩🏼➕🐠🍴🐙🐟🦀🏝💏',
    phrase: 'The Little Mermaid',
  },
  //{
    //prompt: '📽👻👻👊👊🚓',
    //phrase: 'Ghostbusters',
  //},
  {
    prompt: '🎮🛡⚔🍃👸',
    phrase: 'The Legend of Zelda',
  },
  {
    prompt: '🎬  🇮🇹🇺🇸👨🏻🚬\n  💀🐴🛏',
    phrase: 'The Godfather',
  },
  {
    prompt: '👨‍👩‍👧‍👦📽  💪🍞📺',
    phrase: 'Brave Little Toaster',
  },
  {
    prompt: '☮️❤️🇬🇧👦🏻👦🏻👦🏻',
    phrase: 'The Beatles',
  },
  {
    prompt: '👱👹⚔🐢  🐀   🍕🍕🍕🍕🍕',
    phrase: 'Teenage Mutant Ninja Turtles',
  },
  {
    prompt: '🎤🌶🙅🏾🙋🏼💁🏻🙎🏼',
    phrase: 'Spice Girls',
  },
];


const initialState = {
  phrases: phrases.map((phrase, id) => ({
    ...phrase,
    id,
  })),
  guesses: [],
  currentPhrase: 0,
};

const getNextPhrase = (pos, direction, phrasesLength) => {
  if (direction) {
    if (pos + 1 >= phrasesLength) {
      return 0;
    }

    return pos + 1;
  }

  if (pos === 0) {
    return phrasesLength - 1;
  }

  return pos - 1;
};

export default typeToReducer({
  [FETCH_GUESSES]: {
    FULFILLED: (state, { payload }) => {
      return {
        ...state,
        guesses: payload.map(guess => ({
          ...guess,
          phraseId: state.currentPhrase,
        })),
      };
    },
  },
  [RECEIVED_MESSAGE]: (state, action) => {
    return {
      ...state,
      guesses: state.guesses.concat({
        ...action.data,
        phraseId: state.currentPhrase,
      }),
    };
  },
  [GO_TO_NEXT_PHRASE]: (state, action) => {
    const nextPhrase = getNextPhrase(
      state.currentPhrase,
      action.direction,
      state.phrases.length
    );

    return {
      ...state,
      currentPhrase: nextPhrase,
    };
  },
}, initialState);

