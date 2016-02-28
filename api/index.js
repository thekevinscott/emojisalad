'use strict';
console.info('1');
if ( ! process.env.ENVIRONMENT ) {
  throw "No environment provided";
}
console.info('2');
require('babel-core/register')
console.info('3');
require('app-module-path').addPath(__dirname);
console.info('4');

require('../shared/scaffolding');
console.info('5');
require('./server'); 
console.info('6');
