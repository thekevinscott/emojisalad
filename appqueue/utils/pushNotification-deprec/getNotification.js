import apn from 'apn';

const DEFAULT_EXPIRATION = 60 * 60 * 24 * 7; // 1 week
const SOUND = 'chime.aiff';

const getPayload = (body, payload) => ({
  expiry: Math.floor(Date.now() / 1000) + DEFAULT_EXPIRATION,
  sound: SOUND,
  alert: {
    body,
  },
  ...payload,
});

const updateNotification = (notification, notificationPayload) => {
  Object.keys(notificationPayload).forEach(key => {
    notification[key] = notificationPayload[key];
  });
  return notification;
};

const getNotification = (body, payload = {}) => {
  const notification = new apn.Notification();
  const notificationPayload = getPayload(body, payload);
  return updateNotification(notification, notificationPayload);
};

export default getNotification;
