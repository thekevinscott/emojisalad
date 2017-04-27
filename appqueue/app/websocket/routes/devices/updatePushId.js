import updatePushId from '../../devices/updatePushId';

export default function (ws, { pushId }, userKey) {
  return updatePushId(userKey, { pushId });
}

