import generateState from './generateState';
export default function getState(fn) {
  const state = generateState();
  return () => {
    return fn(state);
  };
}
