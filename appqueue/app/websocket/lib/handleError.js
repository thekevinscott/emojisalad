/*
 * This prepares a nice error message
 * given some type
 */

export default function handleError(type, message) {
  console.log('error message', message);
  return new Error(JSON.stringify({
    type,
    message,
  }));
}
