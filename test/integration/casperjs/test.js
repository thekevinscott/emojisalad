var casper = require('casper').create();
casper.echo('foo');
casper.start('http://localhost:5000/foo', function() {
  casper.echo('bar');
  this.echo(this.getTitle());
});

casper.run();
