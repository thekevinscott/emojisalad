const local = require('./db-local');
const db = {
  //aws: {
    //"host"     : "emojinaryfriend.cfiretgvvbvv.us-east-1.rds.amazonaws.com",
    //"user"     : "emojinaryfriend",
    //"password" : "mwQWhFruH?bhd8V]nzf8s7WHu?JT",
    //"database" : "emojinaryfriend",
    //"charset"  : "utf8mb4"
  //},
  digitalOcean: {
    "host"     : "45.55.41.73",
    //"host"     : "127.0.0.1",
    "user"     : "emojinaryfriend",
    "password" : "yU2ofgAizVovg9M}7Tu$d3==smAvZjqbAPagxPU7;ufYnCQGBo",
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
//if ( local.api ) {
  //db.api = local.api;
//}

db.production = db.digitalOcean;

module.exports = db;
