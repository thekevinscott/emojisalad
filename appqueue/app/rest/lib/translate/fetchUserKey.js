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

    return (row || {}).user_key;
  });
}

