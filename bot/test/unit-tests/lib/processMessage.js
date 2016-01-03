'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const processMessage = require('lib/processMessage');

describe('Process Message', function() {
  it('loads correctly', function() {
    processMessage.should.be.ok;
  });

});
