'use strict';
const read = require('lib/read');

const main = (req, res) => {
  console.info('main');
  if ( res ) {
    res.end();
  }

  read();
}

module.exports = main;
