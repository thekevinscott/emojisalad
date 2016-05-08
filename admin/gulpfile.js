'use strict';
//To do :  , Livereload

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const stylus = require('gulp-stylus');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const babel = require('babelify');
const nodemon = require('gulp-nodemon');

// Webserver
gulp.task('webserver', () => {
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { 'ENVIRONMENT': process.env.ENVIRONMENT || 'development' }
  });
});




// Read Javascript, run Browserfy, Babel and Uglify (one day...)
gulp.task('js', () => {
  const b = browserify({
    debug: true
  });
  b.transform(babel); // use the babel transform
  b.add('./web/js/main.js');
  const out = b.bundle().on('error', function(err) {
    //If you want details of the error in the console
    console.log(err.toString());
    this.emit('end');
  })
  .pipe(source('app.min.js'))
  .pipe(gulp.dest('./public'))
  .pipe(livereload());

  console.log('JS done.');
  return out;
});


// Stylus
gulp.task('style', () => {
  gulp.src('./web/styles/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});


gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./web/styles/**/*.styl', ['style']);
  gulp.watch('./web/js/**/*', ['js']);
});

gulp.task('default', ['js', 'style', 'webserver', 'watch']);


// gulp.task('default', ['stylus','babel','react']);


