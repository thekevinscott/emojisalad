import fetchFromService from '../websocket/lib/fetchFromService';

export default function pingBot() {
  return fetchFromService({
    service: 'bot',
    route: 'ping',
  });
}
