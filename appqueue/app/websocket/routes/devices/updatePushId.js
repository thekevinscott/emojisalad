import updatePushId from '../../devices/updatePushId';

export default function (ws, { pushId, pushToken }, userKey) {
  return updatePushId(userKey, { pushId, pushToken });
}

