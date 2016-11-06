'use strict';
const getWebSubmissions = require('lib/getWebSubmissions');
const getJungleSubmissions = require('lib/getJungleSubmissions');
const store = require('store');

module.exports = ({
  web,
}) => {
  return store('include_jungle').then(INCLUDE_JUNGLE => {
    const phones = getWebSubmissions(web);
    if (INCLUDE_JUNGLE) {
      return phones.concat(getJungleSubmissions());
    }

    return phones;
  });
};
