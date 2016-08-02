/*
 * Get the users matching a certain query
 */

import fetchFromService from '../../../utils/fetchFromService';

export default function getUsers(query) {
  return fetchFromService({
    service: 'api',
    route: 'users.get',
    options: {
      body: {
        from: query,
      },
    },
  });
}
