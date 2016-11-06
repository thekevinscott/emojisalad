import {
  fetchGuesses,
} from './actions';

const isCorrect = (guess, phrase) => {
  return guess.message === phrase;
};

const selectGuesses = (guesses, phrase) => {
  const validGuess = (guess, obj) => {
    if (!obj[guess.number]) {
      return true;
    }

    const currentDate = new Date(obj[guess.number].created);
    const newDate = new Date(guess.created);

    if (currentDate < newDate && !isCorrect(obj[guess.number], phrase)) {
      return true;
    }

    return false;
  };

  const guessObj = guesses.reduce((obj, guess) => {
    if (validGuess(guess, obj)) {
      //console.log(guess, obj[guess.number]);
      return {
        ...obj,
        [guess.number]: {
          ...guess,
          correct: isCorrect(guess, phrase),
        },
      };
    }

    return obj;
  }, {});

  console.log(guessObj);
  return Object.keys(guessObj).map(number => {
    return guessObj[number];
  }).sort((a, b) => {
    return new Date(b.created) - new Date(a.created);
  });
};

export function mapStateToProps({
  phrases,
  user: {
    currentPhrase,
  },
  guesses,
}) {
  const {
    phrase,
    prompt,
  } = phrases[currentPhrase];

  return {
    phrase,
    prompt,
    guesses: selectGuesses(guesses, phrase),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchGuesses: () => dispatch(fetchGuesses()),
  };
}
