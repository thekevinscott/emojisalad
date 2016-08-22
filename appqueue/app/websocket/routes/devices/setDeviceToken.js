import setDevice from '../../devices/setDevice';

export default function (ws, { device_token }, userKey) {
  return setDevice(userKey, { device_token });
}
