module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  HOST: 'localhost',
  PORT: (parseInt(process.env.PORT, 10)) ? process.env.PORT : 5012,
  NAME: 'appqueue',
  LOG_LEVEL: 'info',
  REQUIRED_SERVICES: [
    'api',
    'sms',
  ],
};
