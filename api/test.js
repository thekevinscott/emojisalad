require('chai');
var should = require('chai').should() //actually call the function
describe('foo', function() {
  it('only bars', function() {
    'foo'.should.equal('foo');
    debugger;
    'foo'.should.equal('bar');
  });
});
