import Squel from 'squel';
import db from 'db';

const squel = Squel.useFlavour('mysql');

const getDevice = userKey => {
  const getDeviceQuery = squel
  .select()
  .from('devices')
  .where('user_key = ?', userKey);

  return db.query(getDeviceQuery).then(devices => {
    console.log('devices back', devices.length, devices);
    if (devices.length === 0) {
      console.error('Super weird, no devices found for user key', userKey, ' that shouldnt ever happen');
      console.error(getDeviceQuery.toString());
      throw new Error(`No devices found for ${userKey}`);
    } else if (devices.length > 1) {
      console.error('also weird, multiple devices found for ', userKey);
      console.error(getDeviceQuery.toString());
      throw new Error(`Multiple devices found for ${userKey}`);
    }

    return devices[0];
  }).then(deviceRow => {
    return {
      ...deviceRow,
      device: JSON.parse(deviceRow.device),
    };
  });
};

export default getDevice;
