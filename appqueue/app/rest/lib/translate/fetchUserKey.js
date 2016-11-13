import fetchFromDevice from './fetchFromDevice';

export default function fetchUserKey(phoneNumber) {
  console.info('fetch user key from phone number', phoneNumber);
  return fetchFromDevice([
    'user_key',
  ], {
    'number=?': phoneNumber,
  }).then(row => {
    console.info('getting user key', row, 'for', phoneNumber);
    if (!row || !row.user_key) {
      throw new Error(`No user key found for ${phoneNumber}`);
    }

    const userKey = (row || {}).user_key;

    console.info('user key is', userKey);
    return userKey;
  });
}

