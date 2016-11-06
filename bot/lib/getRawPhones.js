'use strict';
const getWebSubmissions = require('lib/getWebSubmissions');
const getJungleSubmissions = require('lib/getJungleSubmissions');
const store = require('store');

module.exports = ({
  web,
}) => {
  return store('include_jungle').then(INCLUDE_JUNGLE => {
    return getWebSubmissions(web).then((phones = []) => {
      if (INCLUDE_JUNGLE) {
        return phones.concat(getJungleSubmissions());
      }

      return phones;
    });
  });
};
