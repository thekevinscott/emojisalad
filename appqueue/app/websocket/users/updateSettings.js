// update protocol on user
// copy messages over
import fetchFromService from '../../../utils/fetchFromService';

export default function createUser({ data }) {
  const body = Object.keys(data).reduce((obj, key) => {
    if (key === 'key') {
      return obj;
    }

    return {
      ...obj,
      [key]: data[key],
    };
  }, {});

  return fetchFromService({
    service: 'api',
    route: 'users.update',
    routeParams: {
      user_id: data.key,
    },
    options: {
      body,
    },
  });
}
