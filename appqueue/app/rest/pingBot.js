import fetchFromService from '../../utils/fetchFromService';

export default function pingBot() {
  return fetchFromService({
    service: 'bot',
    route: 'ping',
  }).catch(err => {
    console.log('Bot is down', err);
  });
}
