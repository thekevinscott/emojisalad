//To do :  , Livereload, Server, (gulp-connect), 

var gulp = require('gulp');

var stylus = require('gulp-stylus');
var browserify = require('browserify');
// var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var babel = require('babelify');
var connect = require('gulp-connect');

gulp.task('js', function() {
console.log('JS');
    var b = browserify();
    b.transform(babel); // use the reactify transform
    b.add('./web/js/main.js');
    var out= b.bundle()
    .on('error', function(err) {
        //If you want details of the error in the console
        console.log(err.toString());
        this.emit('end');
    })

    .pipe(source('app.min.js'))
    .pipe(gulp.dest('./public'));
    console.log('JS done.');
    return out;
});

// Stylus
gulp.task('style', function () {
  gulp.src('./web/styles/main.styl') //Edit me
    .pipe(stylus())
    .pipe(gulp.dest('./public'));
    // .pipe(gulp.dest('./web/styles/')); //Edit me
});


gulp.task('watch', function() {
    gulp.watch('./web/styles/**/*.styl', ['style']);
    gulp.watch('./web/js/**/*', ['js']);
    // gulp.watch('./gulpfile.js', ['js','style']);
});

gulp.task('default', ['js', 'style', 'watch']);


// gulp.task('default', ['stylus','babel','react']);


