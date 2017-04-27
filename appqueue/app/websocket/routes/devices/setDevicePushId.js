import setDevice from '../../devices/setDevice';

export default function (ws, { pushId, pushToken }, userKey) {
  return setDevice(userKey, {
    push_id: pushId,
    push_token: pushToken,
  });
}
