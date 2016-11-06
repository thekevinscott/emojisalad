import {
  FETCH_GUESSES,
  GO_TO_NEXT_PHRASE,
} from './types';

export function fetchGuesses() {
  return {
    type: FETCH_GUESSES,
  };
}

export function goToNextPhrase(direction) {
  return {
    type: GO_TO_NEXT_PHRASE,
    direction,
  };
}
