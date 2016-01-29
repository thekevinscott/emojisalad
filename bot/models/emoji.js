'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
const _ = require('lodash');
const emojiExists = require('emoji-exists');
const db = require('db');
const api = require('config/services').api.url;

const req = Promise.promisify(require('request'));
const request = function(options) {
  //console.log('options', options);
  return req(options).then(function(response) {
    //console.log('re', response);
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error('No response from API in emoji');
    }
  });
}

let Emoji = {
  checkInput: function(str) {
    return request({
      url: `${api}emoji/check`,
      method: 'POST',
      form: { emoji: str } 
    }).then((response) => {
      //console.log('re', response);
      return response;
    });
  },
};

module.exports = Emoji;
