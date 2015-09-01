var accountSid = 'ACf2076b907d44abdd8dc8d262ff941ee4'; 
var authToken = '0d7b1b491ca038d4ff4fdf674cd46aa1'; 


if ( process.env.ENVIRONMENT === 'production' ) {
  var from = "12013409832";
} else {
  var from = "18603814348";
}

module.exports = {
  accountSid: accountSid,
  authToken: authToken,
  from: from
}
