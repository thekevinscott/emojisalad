import fetchFromDevice from './fetchFromDevice';

export default function fetchPhoneNumber(userKey) {
  // I am running an expiriment; can we punt
  // on using the phone number, and just use the raw
  // user key? That would make interacting
  // with the bot a lot easier
  //
  // If everything is working in the app,
  // remove this comment and
  // the below commented code.
  return Promise.resolve(userKey);

  /*
  console.info('fetch phone number from user key', userKey);
  return fetchFromDevice([
    'number',
  ], {
    'user_key=?': userKey,
  }).then(row => {
    if (!row || !row.number) {
      throw new Error(`No phone number found for user key ${userKey}`);
    }
    console.info('phone number is', row.number);
    return row.number;
  });
  */
}
