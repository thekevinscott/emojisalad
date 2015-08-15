var gulp = require('gulp');
var stylus = require('gulp-stylus');
connect = require('gulp-connect');

// Connect server, and make LiveReload happen
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

// Get all .styl files in one folder and render
gulp.task('stylus', function () {
    console.log('Hello!')
    gulp.src('./stylus/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('css'));
});

// Watch HTML for changes, and Live Reload
gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

// Watch for changes
gulp.task('watch', function () {
  gulp.watch(['stylus/*.styl'], ['stylus']);
  gulp.watch(['*.html'], ['html']);
  gulp.watch(['css/*'], ['html']);
});


//Run tasks
gulp.task('default', ['connect', 'stylus', 'html', 'watch'], function() {

});