import fetchFromService from '../../../utils/fetchFromService';

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
  }).catch(err => {
    console.info('server error', err);
    throw new Error('Error communicating with the server');
  });
}
