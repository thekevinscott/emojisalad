import fetchFromService from '../../utils/fetchFromService';

export default function pingBot() {
  return fetchFromService({
    service: 'bot',
    route: 'ping',
  });
}
