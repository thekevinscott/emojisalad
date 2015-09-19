var gulp = require('gulp');
var bower_dir = __dirname + '/web/lib/';





var react = require('gulp-react');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var babel = require('babelify');

gulp.task('js', function() {
console.log('JS');
    var b = browserify();
    b.transform(babel); // use the reactify transform
    b.add('./web/js/app.js');
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

gulp.task('browserify', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  
  return gulp.src(['./web/js/app.js'])
    .pipe(browserified)
    // .pipe(uglify())
    // .pipe(gulp.dest('public'));
});

// Babel
gulp.task('babel', function () {
	var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  

    return gulp.src(['web/js/app.js']) //Needs to be edited
        	
        .pipe(browserified)
        .pipe(babel())
    	.pipe(uglify())
        .pipe(gulp.dest('public')); //Needs to be edited
});

// React
gulp.task('react', function () {
    return gulp.src('template.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'));
});

// Stylus
gulp.task('one', function () {
  gulp.src('./css/one.styl') //Edit me
    .pipe(stylus())
    .pipe(gulp.dest('./css/build')); //Edit me
});



gulp.task('default', ['stylus','babel','react']);

/* 
Things installed:
gulp-babel
*/

/* 
Remove all require CSS from JS
Parse CSS as well

Suck in all JavaScript
cool. Run it through Babble
Export to /public/bundle.js
*/
 
