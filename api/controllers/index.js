'use strict';
const express = require('express');
const _ = require('lodash');

module.exports = function(app) {
  [
    'games',
    'users',
    'emoji',
    'players',
    'invites',
    'rounds',
  ].map((key) => {
    const router = express.Router({ mergeParams: true });
    require(`./${key}`).map((route) => {
      router.route(route.path)[route.method]((req, res) => {
        //const data = ( route.method === 'get' ) ? req.query : req.body;
        try {
          route.fn(req).then((results) => {
            console.info('request successful', route, results);
            res.status(200).json(results);
          }).catch((err) => {
            console.info('request unsuccessful', route, err);
            res.status(400).json({ error: err });
            //console.info('error', err.stack);
          });
        } catch(err) {
          console.info('request unsuccessful', route, err);
          res.status(400).json({ error: err });
          //console.info('error', err.stack);
        }
      });
    });
    app.use(`/${key}`, router);

  });

  app.get('/', function(req, res){
    res.send('hello world');
  });
};
