module.exports = {
  //PUSHCITY: {
    //URL: 'https://api.pushcityapp.com/api/v1/',
    //API_KEY: '94065890d025a5989ddf0b67862d62739e77ef64af0c9e6050a46a9796380d43',
  //},
  ONE_SIGNAL: {
    API_KEY: 'OWE3MTY3MDctNmQ3NS00MWY3LTkzZmEtM2JhYTI3NjNjM2Fk',
    APP_ID: 'f5e80a38-fcc6-4f7c-bfcf-fb82da346390',
  },
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  HOST: 'localhost',
  PORT: (parseInt(process.env.PORT, 10)) ? process.env.PORT : 5012,
  NAME: 'appqueue',
  LOG_LEVEL: 'info',
  REQUIRED_SERVICES: [
    'api',
    //'sms',
  ],
};
