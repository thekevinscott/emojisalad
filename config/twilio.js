'use strict';

module.exports = {
  production: {
    accountSid: 'ACf2076b907d44abdd8dc8d262ff941ee4',
    authToken: '0d7b1b491ca038d4ff4fdf674cd46aa1',
    from : "12013409832"
  },
  test: {
    accountSid: 'ACd3092d2941863e4339df5d7c63271bdb',
    authToken: 'c40263d435427a539272efb4624517be',
    from : "18609104640"
  },
  development: {
    accountSid: 'ACd3092d2941863e4339df5d7c63271bdb',
    authToken: 'c40263d435427a539272efb4624517be',
    from : "18609104640"
  }
}[process.env.ENVIRONMENT];
