const gulp = require('gulp');
const stylus = require('gulp-stylus');
const connect = require('gulp-connect');
const nodemon = require('gulp-nodemon');

// Connect server, and make LiveReload happen
gulp.task('connect', () => {
  connect.server({
    root: './',
    livereload: true
  });
});

// Get all .styl files in one folder and render
gulp.task('stylus',  () => {
  gulp.src('./stylus/style.styl')
  .pipe(stylus())
  .pipe(gulp.dest('css'));
});

// Watch HTML for changes, and Live Reload
gulp.task('html',  () => {
  gulp.src('./*.html')
  .pipe(connect.reload());
});

// Watch for changes
gulp.task('watch',  () => {
  gulp.watch(['stylus/*.styl'], ['stylus']);
  gulp.watch(['*.html'], ['html']);
  gulp.watch(['css/*'], ['html']);
  gulp.watch(['js/*'], ['html']);
});

//Run tasks
gulp.task('default', ['stylus', 'watch'], () => {
  nodemon({
    script: 'server.js',
    env: { 'ENVIRONMENT': 'development' }
  });
});
