import {
  fetchGuesses,
} from './actions';

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
    guesses,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    fetchGuesses: () => dispatch(fetchGuesses()),
  };
}
