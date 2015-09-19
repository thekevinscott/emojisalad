//To do :  , Livereload

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
// var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var babel = require('babelify');
var nodemon = require('gulp-nodemon');

// Webserver
gulp.task('webserver', function() {
	nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'production' }
  })
  
});




// Read Javascript, run Browserfy, Babel and Uglify (one day...)
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
    .pipe(gulp.dest('./public'))
    .pipe(livereload())
    console.log('JS done.');
    return out;
});


// Stylus
gulp.task('style', function () {
  gulp.src('./web/styles/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});


gulp.task('watch', function() {
	livereload.listen();
    gulp.watch('./web/styles/**/*.styl', ['style']);
    gulp.watch('./web/js/**/*', ['js']);
    // gulp.watch('./gulpfile.js', ['js','style']);
});

gulp.task('default', ['js', 'style', 'webserver', 'watch']);


// gulp.task('default', ['stylus','babel','react']);


