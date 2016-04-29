const chai = require('chai');
chai.should();
chai.use(require('chai-datetime'));
const expect = chai.expect;
const lzw = require('node-lzw');
chai.use(require('chai-datetime'));
const d = require('node-discover')();

require('../../shared/scaffolding');

describe('API tests', () => {
  before((done) => {
    d.on('added', (obj) => {
      if ( obj.advertisement ) {
        const service = JSON.parse(lzw.decode(obj.advertisement));
        if ( service.name === 'testqueue' && service.available ) {
          done();
        }
      }
    });
  });

  require('server');
  require ('./unit/controllers');
  require ('./unit/models');
});
