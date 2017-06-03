import fb from 'utils/fb';
import getUsers from '../users/getUsers';

const getApi = (api, path, options, index = 0) => {
  // collate with our local records
  //if (path === 'me/friends') {
    //return api(path).then(({
      //data,
      //paging,
      //summary,
    //}) => {
      //return getUsers({
        //facebookIds: data.map(friend => friend.id).join(','),
      //}).then(users => {
        //const usersById = users.reduce((obj, user) => ({
          //...obj,
          //[user.facebookId]: user,
        //}), {});

        //return {
          //paging,
          //summary,
          //data: data.map(friend => ({
            //...friend,
            //...usersById[friend.id],
          //})),
        //};
      //}).catch(err => {
        //console.error('user error', err);
      //});
    //});
  //}

  return api(path, options).then(({
    data,
    paging,
  }) => {
    if (paging) {
      return getApi(api, path, {
        after: paging.cursors.after,
      }, index + 1).then(({
        data: moreData,
        index: thisIndex,
      }) => {
        return {
          data: data.concat(moreData),
          index: thisIndex,
        };
      });
    }

    return {
      data,
      index,
    };
  });
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

    const promises = path.map(p => {
      return getApi(api, p).then((res) => {
        return res;
      }).catch(err => {
        console.error('Api error', p, err);
      });
    });
    return Promise.all(promises).then(data => {
      return data.reduce((obj, d, index) => ({
        ...obj,
        [path[index]]: d,
      }), {});
    }).catch(err => {
      console.error('Some error', err);
    });
  });
};
