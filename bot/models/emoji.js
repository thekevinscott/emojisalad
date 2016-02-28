'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
const _ = require('lodash');
const emojiExists = require('emoji-exists');
const db = require('db');

const api = require('../service')('api');

const Emoji = {
  checkInput: function(str) {
    return api('emoji', 'checkInput', { emoji: str }); 
  },
};

module.exports = Emoji;
