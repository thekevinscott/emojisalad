
console.log('API db', process.env.ENVIRONMENT);
const config = require(`./config/database/${process.env.ENVIRONMENT}`);
let db = require('../db')(config);

db.create = (query) => {
  return db.query(query).then((result) => {
    if ( result && result.insertId ) {
      return result;
    } else {
      throw new Error(`There was an error creating for query: ${query.toString()}`);
    }
  });
}
module.exports = db;
