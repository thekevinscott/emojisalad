import {
  FETCH_GUESSES,
} from './types';

export function fetchGuesses() {
  return {
    type: FETCH_GUESSES,
  };
}
