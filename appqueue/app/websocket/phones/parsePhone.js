import fetchFromService from '../lib/fetchFromService';

export default function parsePhone(number) {
  return fetchFromService(
    'sms',
    'phone',
    {
      qs: {
        number,
      },
    },
  ).then(response => {
    return response.number;
  });
}
