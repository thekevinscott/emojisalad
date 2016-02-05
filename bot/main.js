'use strict';
const read = require('lib/read');

const main = (req, res) => {
  if ( res ) {
    res.end();
  }

  read();
}

module.exports = main;
