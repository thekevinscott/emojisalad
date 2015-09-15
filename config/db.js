var local = require('./db-local');
var db = {
  production: {
    "host"     : "emojinaryfriend.cfiretgvvbvv.us-east-1.rds.amazonaws.com",
    "user"     : "emojinaryfriend",
    "password" : "mwQWhFruH?bhd8V]nzf8s7WHu?JT",
    "database" : "emojinaryfriend",
    "charset"  : "utf8mb4"
  },
};

if ( local.test ) {
  db.test = local.test;
}
if ( local.development ) {
  db.development = local.development;
}

module.exports = db[process.env.ENVIRONMENT];
