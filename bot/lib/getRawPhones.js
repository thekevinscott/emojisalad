'use strict';
const getWebSubmissions = require('lib/getWebSubmissions');
const getJungleSubmissions = require('lib/getJungleSubmissions');
const store = require('store');

module.exports = ({
  web,
}) => {
  return getWebSubmissions(web);
};
