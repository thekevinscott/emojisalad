/* eslint-disable camelcase */
import Squel from 'squel';
import db from 'db';

function DeviceError(message, code) {
  this.message = message;
  this.code = code;
  this.stack = (new Error()).stack;
}
DeviceError.prototype = Object.create(Error.prototype);
DeviceError.prototype.constructor = DeviceError;

const squel = Squel.useFlavour('mysql');

const getDevice = userKey => {
  const getDeviceQuery = squel
  .select()
  .from('devices')
  //.where('number IS NOT NULL')
  .where('user_key = ?', userKey);

  console.info(getDeviceQuery.toString());
  return db.query(getDeviceQuery).then(devices => {
    //console.log('devices back', devices.length, devices);
    if (devices.length === 0) {
      //console.error('Super weird, no devices found for user key', userKey, ' that shouldnt ever happen');
      //console.error(getDeviceQuery.toString());
      throw new DeviceError(`No devices found for ${userKey}`, 1);
    } else if (devices.length > 1) {
      console.error('weird, multiple devices found for ', userKey);
      console.error(getDeviceQuery.toString());
      throw new DeviceError(`Multiple devices found for ${userKey}`, 2);
    }

    return devices[0];
  }).then(deviceRow => {
    let device_info;
    try {
      device_info = JSON.parse(deviceRow.device_info);
    } catch (err) {
      console.error('error with parsing json for device', deviceRow);
      device_info = {};
    }
    return {
      ...deviceRow,
      device_info,
    };
  });
};

export default getDevice;
