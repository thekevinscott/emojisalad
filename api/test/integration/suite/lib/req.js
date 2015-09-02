var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var _ = require('lodash');

var xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 

var host = 'http://localhost:'+process.env.PORT;

function req(options, params, raw) {
  options = _.assign({
    method: 'POST'
  }, params, options);

  options.url = host + params.url;

  if ( options.form ) {
    var user = options.form.username;
    var message = options.form.message;
    delete options.form.username;
    delete options.form.message;

    options.form[params.userKey] = user;
    options.form[params.messageKey] = message;
  }

  return request(options).then(function(response) {
    var resp = response[0];
    var body = response[1];
    var content_type = resp.headers['content-type'];
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
      console.log('wtf?');
      console.log('body', body);
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
  }, params, raw);
}

function Req() {
  this.q = req;
  this.p = post;
  this.setParams = function(data) {
    params = _.assign({}, params, data);
  }
}

module.exports = new Req();