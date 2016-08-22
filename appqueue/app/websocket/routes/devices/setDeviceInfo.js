import setDevice from '../../devices/setDevice';

export default function (ws, { device_info }, userKey) {
  console.log('the info', device_info);
  return setDevice(userKey, {
    device_info: JSON.stringify(device_info),
  });
}
