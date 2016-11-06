import Levenshtein from 'levenshtein';

import {
  fetchGuesses,
  goToNextPhrase,
} from './actions';

const isCorrect = ({
  message: guess,
}, phrase) => {
  const distance = new Levenshtein(guess.toLowerCase(), phrase.toLowerCase());

  return distance < 5;
};

const validGuess = (guess, obj, phrase) => {
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

const selectGuesses = (guesses, {
  phrase,
  id: phraseId,
}) => {
  let foundCorrect = false;
  const guessObj = guesses.filter(guess => {
    return guess.phraseId === phraseId;
  }).reduce((obj, guess) => {
    if (validGuess(guess, obj, phrase)) {
      const correct = isCorrect(guess, phrase);

      if (correct) {
        foundCorrect = true;
      }

      return {
        ...obj,
        [guess.number]: {
          ...guess,
          correct,
        },
      };
    }

    return obj;
  }, {});

  return {
    correct: foundCorrect,
    guesses: Object.keys(guessObj).map(number => {
      return guessObj[number];
    }).sort((a, b) => {
      if (a.correct) {
        return -1;
      }
      if (b.correct) {
        return 1;
      }
      return new Date(b.created) - new Date(a.created);
    }),
  };
};

export function mapStateToProps({
  data: {
    phrases,
    currentPhrase,
    guesses: originalGuesses,
  },
}) {
  const {
    phrase,
    id,
    prompt,
  } = phrases[currentPhrase];

  const {
    guesses,
    correct,
  } = selectGuesses(originalGuesses, {
    phrase,
    id,
  });

  return {
    phrase,
    prompt,
    guesses,
    correct,
    phrases,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchGuesses: () => dispatch(fetchGuesses()),
    goToNextPhrase: (phrases, direction) => dispatch(goToNextPhrase(phrases, direction)),
  };
}
