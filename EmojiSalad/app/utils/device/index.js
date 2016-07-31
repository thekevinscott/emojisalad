//const DeviceInfo = require('react-native-device-info');

const INFO = (function getInfo() {
  const deviceInfo = {
    OFF: 'true',
  };
  /*
  const deviceInfo = {
    // e.g. FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
    // * note this is IDFV on iOS so it will change if all apps from the current apps vendor have been previously uninstalled
    uniqueID: DeviceInfo.getUniqueID(),

    // e.g. Apple
    manufacturer: DeviceInfo.getManufacturer(),

    // e.g. iPhone 6
    model: DeviceInfo.getModel(),

    // e.g. iPhone7,2 / or the board on Android e.g. goldfish
    deviceID: DeviceInfo.getDeviceId(),

    // e.g. iPhone OS
    systemName: DeviceInfo.getSystemName(),

    // e.g. 9.0
    version: DeviceInfo.getSystemVersion(),

    // e.g. com.learnium.mobile
    bundleID: DeviceInfo.getBundleId(),

    // e.g. 89
    buildNumber: DeviceInfo.getBuildNumber(),

    // e.g. 1.1.0
    appVersion: DeviceInfo.getVersion(),

    // e.g. 1.1.0.89
    readableAppVersion: DeviceInfo.getReadableVersion(),

    // e.g. Becca's iPhone 6
    deviceName: DeviceInfo.getDeviceName(),

    // e.g. Dalvik/2.1.0 (Linux; U; Android 5.1; Google Nexus 4 - 5.1.0 - API 22 - 768x1280 Build/LMY47D)
    userAgent: DeviceInfo.getUserAgent(),

    // e.g en-US
    locale: DeviceInfo.getDeviceLocale(),

    // e.g US
    country: DeviceInfo.getDeviceCountry(),
  };
  */

  /*
  if (DeviceInfo.getInstanceID) {
    return {
      ...deviceInfo,

      // ANDROID ONLY - see https://developers.google.com/instance-id/
      appInstanceID: DeviceInfo.getInstanceID(),
    };
  }
  */

  return deviceInfo;
}());

export default INFO;
