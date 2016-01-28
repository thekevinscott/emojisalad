'use strict';
const express = require('express');
const _ = require('lodash');

module.exports = function(app) {
  ['users','players'].map((key) => {
    const router = express.Router({ mergeParams: true });
    require(`./${key}`).map((route) => {
      router.route(route.path)[route.method]((req, res) => {
        const data = ( route.method === 'get' ) ? req.query : req.body;
        try {
          route.fn(data, req.params).then((results) => {
            res.status(200).json(results);
          }).catch((err) => {
            console.error(err);
            res.status(400).json({ error: err });
          });
        } catch(err) {
          res.status(400).json({ error: err });
        }
      });
    });
    app.use(`/${key}`, router);

  });

  app.get('/', function(req, res){
    res.send('hello world');
  });
};
