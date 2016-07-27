module.exports = {
  HOST: 'localhost',
  PORT: process.env.PORT || 5012,
  NAME: 'appqueue',
  LOG_LEVEL: 'info',
  REQUIRED_SERVICES: [
    'api',
    'sms',
  ],
};
