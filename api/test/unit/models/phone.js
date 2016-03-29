'use strict';
//const squel = require('squel');
//const db = require('db');
//const proxyquire = require('proxyquire');
//const User = require('models/user');
const Phone = require('models/phone');
//const post = require('test/support/request').post;
//const Promise = require('bluebird');
//const EMOJI = '👍';

describe('Phone', () => {
  describe('parse', () => {
    it('should reject a blank number', () => {
      return Phone.parse('').catch((err) => {
        err.should.equal(1);
      });
    });

    it('should reject an invalid string', () => {
      return Phone.parse('foo').catch((err) => {
        err.should.equal(1);
      });
    });

    it('should reject an invalid number', () => {
      return Phone.parse('555').catch((err) => {
        err.should.equal(1);
      });
    });

    it('should parse a phone number', () => {
      return Phone.parse('555-555-5555').catch((err) => {
        err.should.equal(1);
      });
    });

    it('should parse a phone number', () => {
      return Phone.parse('860-460-8183').then((phone) => {
        phone.should.equal('+18604608183');
      });
    });

    it('should parse a formatted phone number', () => {
      return Phone.parse('( 860 ) 460-8183').then((phone) => {
        phone.should.equal('+18604608183');
      });
    });
  });
});
