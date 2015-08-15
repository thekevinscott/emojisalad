var gulp = require('gulp');
var stylus = require('gulp-stylus');
var livereload = require('gulp-livereload');
var lr;

// Express server
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

// Get all .styl files in one folder and render
gulp.task('stylus', function () {
    gulp.src('./stylus/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./css/'))
        .pipe(livereload());
});

// Let the system notify the browser to refresh
gulp.task('startLiveReload', function(){
	livereload({ start: true });
});

function notifyLiveReload(event) {
  gulp.src(event.path, {read: false})
      .pipe(require('gulp-livereload')(lr));
};	

//Watch for changes
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('stylus/*.styl', ['stylus']);
	gulp.watch('*.html', notifyLiveReload);
	gulp.watch('css/*.css', notifyLiveReload);
});

//Run tasks
gulp.task('default', ['express','stylus','startLiveReload','watch'], function() {

});