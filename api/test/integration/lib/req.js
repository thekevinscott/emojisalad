'use strict';
let Promise = require('bluebird');
let request = Promise.promisify(require("request"));
let _ = require('lodash');

let xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 

let host = 'http://localhost:'+process.env.PORT;
let twilio_config = require('../../../../config/twilio').production;

function req(options, raw) {
  options = _.assign({
    method: 'POST'
  }, options);

  options.url = host + '/platform/twilio';

  if ( options.form ) {
    let user = options.form.user;
    if ( ! _.isObject(user) ) {
      console.error('user', user);
      throw "You must provide user as an object now";
    }
    let message = options.form.message;
    delete options.form.username;
    delete options.form.message;

    options.form.From = user.number;
    options.form.To = twilio_config.from;
    options.form.Body = message;
  }

  return request(options).then(function(response) {
    let resp = response[0];
    let body = response[1];
    let content_type = resp.headers['content-type'];
    if ( content_type === 'text/xml' ) {
      if ( raw ) {
        return xml2js(body);
      } else {
        return xml2js(body).then(function(data) {
          try {
            return data.Response.Message;
          } catch(e) {
            console.error('Error parsing XML response', e);
            console.error(body);
          }
        });
      }
    } else if (content_type.indexOf('text/html') !== -1 ) {
      console.error('wtf?');
      console.error('body', body);
    } else if ( content_type.indexOf('application/json') !== -1 ) {
      if ( _.isString(body) ) {
        body = JSON.parse(body);
      }
    } else {
      console.log('content type', resp.headers['content-type']);
    }
    return body;
  });
}

function post(data, params, raw) {
  return req({
    form: data
  }, raw);
}

function Req() {
  this.q = req;
  this.p = post;
  this.post = post;
}

module.exports = new Req();
