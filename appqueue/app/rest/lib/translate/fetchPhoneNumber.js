import fetchFromDevice from './fetchFromDevice';

export default function fetchPhoneNumber(userKey) {
  return fetchFromDevice([
    'number',
  ], {
    'user_key=?': userKey,
  }).then(row => {
    if (!row || !row.number) {
      throw new Error(`No phone number found for user key ${userKey}`);
    }
    return row.number;
  });
}
