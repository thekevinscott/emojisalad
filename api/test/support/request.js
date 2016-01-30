const port = process.env.PORT || 1338;
const request = require('supertest')(`http://localhost:${port}`);
                                     
const _ = require('lodash');

function post(params) {
  return new Promise((resolve, reject) => {
    request 
    .post(params.url)
    .send(params.data)
    .set('Accept', 'application/json')
    .end((error, res) => {
      if ( error ) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function get(params) {
  return new Promise((resolve, reject) => {
    request 
    .get(params.url)
    .query(params.data)
    .set('Accept', 'application/json')
    .end((error, res) => {
      error ? reject(error) : resolve(res);
    });
  });
}

function put(params) {
  return new Promise((resolve, reject) => {
    request 
    .put(params.url)
    .send(params.data)
    .set('Accept', 'application/json')
    .end((error, res) => {
      if ( error ) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function del(params) {
  return new Promise((resolve, reject) => {
    request 
    .del(params.url)
    //.send(params.data)
    .set('Accept', 'application/json')
    .end((error, res) => {
      if ( error ) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}


module.exports = {
  post: post,
  get: get,
  put: put,
  del: del
};
