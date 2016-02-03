'use strict';
const concatenate = require('lib/concatenateMessages');
const join_string = concatenate.join_string;

describe('Concatenate Messages', function() {
  it('loads correctly', function() {
    concatenate.should.be.ok;
  });

  it('should throw an error with invalid messages', function() {
    function throwingFunction(data) {
      return function() {
        concatenate(data);
      };
    }
    throwingFunction([]).should.throw();
    throwingFunction([{}]).should.throw();
    throwingFunction([{
      body: 'foo'
    }]).should.throw();
    throwingFunction([{
      body: 'foo',
      to: 'bar'
    }]).should.throw();
    throwingFunction([{
      body: 'foo',
      from: 'bar'
    }]).should.throw();
  });

  it('should return an array of messages', function() {
    let msgs = [{
      to: 'bar',
      from: 'baz',
      body: 'foo',
    }];
    concatenate(msgs).should.deep.equal(msgs);
  });

  it('should concatenate two messages to the same person', function() {
    let msgs = [{
      to: 'bar',
      from: 'baz',
      body: 'foo',
    }, {
      to: 'bar',
      from: 'baz',
      body: 'foo2',
    }];
    concatenate(msgs).should.deep.equal([
      {
        to: 'bar',
        from: 'baz',
        body: ['foo','foo2'].join(join_string)
      }
    ]);
  });

  it('should concatenate four messages to two people', function() {
    let msgs = [{
      to: 'bar',
      from: 'baz',
      body: 'foo',
    }, {
      to: 'bar2',
      from: 'baz',
      body: 'foo',
    }, {
      to: 'bar',
      from: 'baz',
      body: 'foo2',
    }, {
      to: 'bar2',
      from: 'baz',
      body: 'foo2',
    }];
    concatenate(msgs).should.deep.equal([
      {
        to: 'bar',
        from: 'baz',
        body: ['foo','foo2'].join(join_string)
      },
      {
        to: 'bar2',
        from: 'baz',
        body: ['foo','foo2'].join(join_string)
      }
    ]);
  });

  it('should not concatenate two messages to the same person from different numbers', function() {
    const msgs = [{
      to: 'bar',
      from: 'baz',
      body: 'foo',
    }, {
      to: 'bar',
      from: 'baz2',
      body: 'foo2',
    }];
    concatenate(msgs).should.deep.equal([
      {
        to: 'bar',
        from: 'baz',
        body: 'foo'
      },
      {
        to: 'bar',
        from: 'baz2',
        body: 'foo2'
      }
    ]);
  });
});
