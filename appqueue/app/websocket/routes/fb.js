import fb from 'utils/fb';
import getUsers from '../users/getUsers';

const getApi = (api, path) => {
  // collate with our local records
  if (path === 'me/friends') {
    return api(path).then(({
      data,
      paging,
      summary,
    }) => {
      return getUsers({
        facebookIds: data.map(friend => friend.id).join(','),
      }).then(users => {
        const usersById = users.reduce((obj, user) => ({
          ...obj,
          [user.facebookId]: user,
        }), {});

        return {
          paging,
          summary,
          data: data.map(friend => ({
            ...friend,
            ...usersById[friend.id],
          })),
        };
      });
    });
  }

  return api(path);
};

export default function fbApi(ws, {
  token,
  path,
}) {
  if (!token) {
    throw new Error('You must provide a token');
  }
  if (!path) {
    throw new Error('You must provide a path');
  }
  return fb(token).then(api => {
    if (typeof(path) === 'string') {
      return getApi(api, path);
    }

    return Promise.all(path.map(p => getApi(api, p))).then(data => {
      return data.reduce((obj, d, index) => ({
        ...obj,
        [path[index]]: d,
      }), {});
    });
  });
};
