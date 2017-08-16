import {
  ENVIRONMENT,
} from './app';

let db;

if (ENVIRONMENT === 'production') {
  db = {
    host: '45.55.41.73',
    user: 'emojinaryfriend',
    password: 'yU2ofgAizVovg9M}7Tu$d3==smAvZjqbAPagxPU7;ufYnCQGBo',
    database: 'appqueue',
    charset: 'utf8mb4',
    timezone: '-05:00', // NYC
  };
} else {
  db = {
    host: '127.0.0.1',
    user: 'emojinaryfriend',
    password: '*dsfji34resdf___sdfsdf',
    database: 'appqueue',
    charset: 'utf8mb4',
    timezone: '-05:00', // NYC
  };
}

module.exports = db;

module.exports.api = {
  host: '127.0.0.1',
  user: 'emojinary',
  password: '*dsfji34resdf___sdfsdf',
  database: 'emojinary',
  charset: 'utf8mb4',
  timezone: '-05:00', // NYC
};

module.exports.sms = {
  host: '127.0.0.1',
  user: 'emojinaryfriend',
  password: '*dsfji34resdf___sdfsdf',
  database: 'smsqueue',
  charset: 'utf8mb4',
  timezone: '-05:00', // NYC
};
