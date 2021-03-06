var gulp = require('gulp'),
	bower = require('gulp-bower'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	iconify = require('gulp-iconify'),
	jshint = require('gulp-jshint'),
	jshintStylist = require('jshint-stylish'),
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	scsslint = require('gulp-scss-lint'),
	uglify = require('gulp-uglify'),
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

// Static Server + watching scss/html files
gulp.task('serve', ['css'], function() {

    browserSync.init({
        server: "./"
    });

	gulp.watch(config.sassPath + '/*.scss', ['css']);
	gulp.watch(config.jsPath + '/*.js', ['js']);
    gulp.watch("/*.html").on('change', browserSync.reload);
});

gulp.task('css', function() {
	return gulp.src(config.sassPath + '/*.scss')
		.pipe(scsslint())
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(config.cssPath))
        .pipe(browserSync.stream());
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
				config.jsPath + '/canvas-org-chart.js',
				config.jsPath + '/chart-node.js',
				config.jsPath + '/chart-line.js',
				config.jsPath + '/script.js'
			]

			gulp.src(minified)
				.pipe(concat('script.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest(config.jsPath))
        		.pipe(browserSync.stream());
		});
});

gulp.task('svg', function() {
    iconify({
        src: './res/svg/*.svg',
        pngOutput: './res/svg',
		cssOutput: false
    });
});

gulp.task('watch', function() {
	gulp.watch(config.sassPath + '/*.scss', ['css']);
	gulp.watch(config.jsPath + '/*.js', ['js']);
});

gulp.task('default', ['bower', 'serve', 'css', 'js', 'svg']);