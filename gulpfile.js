var gulp = require('gulp'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	bower = require('gulp-bower'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	jshintStylist = require('jshint-stylish'),
	scsslint = require('gulp-scss-lint'),
	vinylPaths = require('vinyl-paths');
	
var config = {
	sassPath: './res/scss',
	cssPath: './res/css',
	jsPath: './res/js',
	fontPath: './res/fonts',
	bowerDir: './res/bower_components'	
};

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(config.bowerDir))
		.on('end', function() {
			gulp.src(config.bowerDir + '/bootstrap-sass-official/assets/fonts/*/*')
				.pipe(gulp.dest(config.fontPath));
		});
});

gulp.task('css', function() {
	return gulp.src(config.sassPath + '/*.scss')
		.pipe(scsslint())
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(config.cssPath));
});

gulp.task('js', function() {
	return gulp.src([config.jsPath + '/*.js', '!' + config.jsPath + '/*.min.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('end', function() {
			var minified = [
				config.bowerDir + '/jquery/dist/jquery.js',
				config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
				config.jsPath + '/script.js'
			]
			
			gulp.src(minified)
				.pipe(concat('script.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest(config.jsPath));
		});
});

gulp.task('watch', function() {
	gulp.watch(config.sassPath + '/*.scss', ['css']);
	gulp.watch(config.jsPath + '/*.js', ['js']);
});

gulp.task('default', ['bower', 'css', 'js']);