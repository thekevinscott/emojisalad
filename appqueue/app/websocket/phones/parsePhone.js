import fetchFromService from '../lib/fetchFromService';

export default function parsePhone(number) {
  return fetchFromService({
    service: 'sms',
    route: 'phone',
    options: {
      body: {
        number,
      },
    },
  }).then(response => {
    console.log('response', response);
    return response.number;
  });
}
