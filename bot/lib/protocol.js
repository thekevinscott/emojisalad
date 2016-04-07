'use strict';

const allowed_protocols = process.env.PROTOCOLS.split(',');
const Promise = require('bluebird');
const squel = require('squel');
const db = require('db');
const protocol_ids = {};
const query = squel.
              select()
              .from('protocols')
              .where('name IN ?', allowed_protocols);

db.query(query).then((rows) => {
  return rows.map((row) => {
    protocol_ids[row.name] = row.id;
  });
});

module.exports = {
  getID: (protocol) => {
    if ( protocol_ids[protocol] ) {
      return protocol_ids[protocol];
    } else {
      throw new Error("You knew this day would come. You knew there would come a time when somebody would try and get a protocol ID before the database query had successfully populated the protocol IDs. You knew this and yet you didn't care. Because you were lazy.");
    }
  }
};

