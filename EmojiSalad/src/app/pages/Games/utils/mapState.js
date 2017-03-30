/* Takes a slice of state that is stored by key as an object,
 * and iterates over that object as if it were an array, calling
 * a callback function with the value of each object in the state.
 */

const mapState = (state, callback) => {
  return Object.keys(state).reduce((obj, key) => ({
    ...obj,
    [key]: callback(state[key], key),
  }), {});
};

export default mapState;
