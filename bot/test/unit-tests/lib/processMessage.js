'use strict';

const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const _ = require('lodash');
const sinon = require('sinon');

function prom(data) {
  return new Promise(function(resolve) {
    resolve(data);
  });
}

function getProcessMessage(obj) {
  function passThru(data) {
    return prom(data);
  }
  return proxyquire('lib/processMessage', _.assign({}, {
    'routes': function(player, body, to) {
      return prom([]);
    },
    'models/message': {
      parse: passThru
    },
    'models/player': {
      get: passThru
    },
    'models/user': {
      get: passThru
    }
  }, obj));
}

describe('Process Message', function() {
  it('loads correctly', function() {
    getProcessMessage().should.be.ok;
  });

  it('throws error if not provided with valid array', () => {
    const processMessage = getProcessMessage({
      'routes': () => {
        return {};
      }
    });
    
    (() => {
      processMessage();
    }).should.throw;
  });

  it('does not call concatenate if there are no messages', () => {
    const spy = sinon.spy();
    const processMessage = getProcessMessage({
      'concatenateMessages': spy
    });
    
    return processMessage({
      from: 'foo',
      to: 'bar',
      body: 'foobar'
    }).finally(() => {
      spy.called.should.equal(false);
    });
  });

  //it('parses outgoing messages', function() {
    //return processMessage({
      //to: 'foo',
      //from: 'bar',
      //body: 'baz'
    //}).then(function() {
      //fn.called.should.equal(true);
    //});
  //});

  //it('gets a player if one exists', function() {
    //const p = {
      //foo: 'bar'
    //};
    //const obj = {
      //'models/player': {
        //get: function() {
          //return prom(p);
        //}
      //},

    //};
    //return getProcessMessage(obj)({
      //to: 'foo',
      //from: 'bar',
      //body: 'baz'
    //}).then(function(player) {
      //player.should.equal(p);
    //});
  //});

  //it('gets a user if one exists', function() {
    //const from = 'bar';
    //const u = {
      //from: from,
      //id: 1,
      //to: 'foo'
    //};
    //const expectation = {
      //state: 'uncreated',
      //user_id: u.id,
      //to: u.to,
      //user: u
    //};
    //const obj = {
      //'models/player': {
        //get: function() {
          //return prom(null);
        //}
      //},
      //'models/user': {
        //get: function() {
          //return prom(u);
        //}
      //},
    //};

    //return getProcessMessage(obj)({
      //to: 'foo',
      //from: 'bar',
      //body: 'baz'
    //}).then(function(player) {
      //player.should.deep.equal(expectation);
    //});
  //});

  //it('initializes a user if none exists', function() {
    //const from = 'bar';
    //const expectation = {
      //state: 'uncreated',
      //from: from
    //};
    //const obj = {
      //'models/player': {
        //get: function() {
          //return prom(null);
        //}
      //},
      //'models/user': {
        //get: function() {
          //return prom(null);
        //}
      //},
    //};

    //return getProcessMessage(obj)({
      //to: 'foo',
      //from: 'bar',
      //body: 'baz'
    //}).then(function(player) {
      //player.should.deep.equal(expectation);
    //});
  //});

});
