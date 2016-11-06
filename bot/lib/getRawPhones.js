'use strict';
const getWebSubmissions = require('lib/getWebSubmissions');
const getJungleSubmissions = require('lib/getJungleSubmissions');

const INCLUDE_JUNGLE = true;

module.exports = ({
  web,
}) => {
  const phones = getWebSubmissions(web);
  if (INCLUDE_JUNGLE) {
    return phones.concat(getJungleSubmissions());
  }

  return phones;
};
