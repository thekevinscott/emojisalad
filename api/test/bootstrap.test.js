'use strict';
let Sails = require('sails');
let sails;
const Promise = require('bluebird');


before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  let rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }
  // Start server
  Sails.lift(rc('sails'), function(err, server) {
    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.
    //
    
    Promise.all([Player, User].map((model) => {
      return model.destroy({
        where: { }
      });
    })).then(() => {
      const numbers = [
        '+15559999999',
        '+15551111111'
      ];
      return Promise.all(numbers.map((number) => {
        return GameNumber.findOrCreate({ where: { number: number } });
      }));
    }).then(() => {
      done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
