var gulp = require('gulp');
var bower_dir = __dirname + '/web/lib/';

/* 
Remove all require CSS from JS
Parse CSS as well

Suck in all JavaScript
Run it through Babble
Export to /public/bundle.js
*/