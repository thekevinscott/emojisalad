import setDeviceInfo from '../../devices/setDeviceInfo';

export default function (ws, { info }, userKey) {
  return setDeviceInfo(userKey, info);
}
