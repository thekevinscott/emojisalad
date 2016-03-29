'use strict';
const express = require('express');
//const _ = require('lodash');

module.exports = function(app) {
  [
    'games',
    'users',
    'emoji',
    'players',
    'invites',
    'rounds',
    'phones'
  ].map((key) => {
    const router = express.Router({ mergeParams: true });
    require(`./${key}`).map((route) => {
      try {
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
      } catch(err) {
        console.error('err', err, route);
        throw new Error('There was an error setting up router');
      }
    });
    app.use(`/${key}`, router);

  });

  app.get('/', (req, res) => {
    res.send('hello world');
  });
};
