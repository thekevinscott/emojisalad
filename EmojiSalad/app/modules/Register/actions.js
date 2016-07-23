import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
  UPDATE_ERROR,
} from './types';

export function submitClaim(text) {
  return {
    type: SUBMIT_CLAIM,
    text,
  };
}

export function updateText(text) {
  return {
    type: UPDATE_TEXT,
    text,
  };
}

export function updateError(error) {
  return {
    type: UPDATE_ERROR,
    error,
  };
}
