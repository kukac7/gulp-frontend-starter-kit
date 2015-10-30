var gulp = require('gulp'),
	del = require('del'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	ngAnnotate = require('gulp-ng-annotate'),
	inject = require('gulp-inject'),
	useref = require('gulp-useref'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	filter = require('gulp-filter'),
	jshint = require('gulp-jshint'),
	imagemin = require('gulp-imagemin'),
	ngHtml2Js = require('gulp-ng-html2js'),
	minifyHtml = require('gulp-minify-html'),
	bowerFiles = require('main-bower-files'),
	rename = require('gulp-rename'),
	gulpsync = require('gulp-sync')(gulp),
	sourcemaps = require('gulp-sourcemaps');

function handleError(err) {
	console.error(err.toString());
	this.emit('end');
}

gulp.task('clean', function(cb) {
	return del(['public/assets', 'public/index.*', '.tmp'], cb);
});

gulp.task('jshint', function() {
	return gulp.src('frontend/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest('public/assets/js'));
});

gulp.task('partials', function () {
	return gulp.src('frontend/partials/**/*.html')
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(ngHtml2Js({
			moduleName: 'app',
			prefix: 'partials/'
		}))
		.pipe(ngAnnotate())
		.pipe(concat('partials.js'))
		.pipe(rev())
		.pipe(rename(function(file) {
			file.extname = '.min.js';
		}))
		.pipe(revReplace())
		.pipe(uglify({
			outSourceMap: true,
			mangle: false,
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('public/assets/partials'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('partials:dev', function () {
	return gulp.src('frontend/partials/**/*.html')
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(ngHtml2Js({
			moduleName: 'app',
			prefix: 'partials/'
		}))
		.pipe(ngAnnotate())
		.pipe(concat('partials.js'))
		.pipe(gulp.dest('public/assets/partials'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('images', function() {
	return gulp.src('frontend/img/**/*')
		//.pipe(imagemin({optimalizationLevel: 5}))
		//.on('error', handleError)
		.pipe(gulp.dest('public/assets/img'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('style', function() {
	var cssFilter = filter('**/*.css');

	return sass('frontend/scss/**/*.scss', {sourcemap: true, noCache: true, style: 'compressed'})
		.on('error', handleError)
		.pipe(cssFilter)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
		.pipe(rev())
		.pipe(rename(function(file) {
			file.extname = '.min.css';
		}))
		.pipe(revReplace())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('public/assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('style:dev', function() {
	var cssFilter = filter('**/*.css');

	return sass('frontend/scss/**/*.scss', {noCache: true, style: 'compressed'})
		.on('error', handleError)
		.pipe(cssFilter)
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
		.pipe(gulp.dest('public/assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('script', function() {
	var jsFilter = filter(['**/*.js', '!vendor*.js']);

	return gulp.src('frontend/js/**/*.js')
		.pipe(jsFilter)
		.pipe(sourcemaps.init())
		.pipe(ngAnnotate())
		.pipe(concat('app.js'))
		.pipe(rev())
		.pipe(rename(function(file) {
			file.extname = '.min.js';
		}))
		.pipe(revReplace())
		.pipe(uglify({
			outSourceMap: true,
			mangle: false,
			compress: {
				drop_console: true
			}
		}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('public/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('script:dev', function() {
	return gulp.src(['frontend/js/**/*.js', '!frontend/js/vendor/*.js'])
		.pipe(gulp.dest('public/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('bower', function() {
	var jsFilter = filter('**/*.js');

	return gulp.src(bowerFiles({
			paths: {
				bowerDirectory: 'vendor/bower_components',
				bowerrc: '.bowerrc',
				bowerJson: 'bower.json'
			}
		}))
		.pipe(jsFilter)
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.js'))
		.pipe(rev())
		.pipe(rename(function(file) {
			file.extname = '.min.js';
		}))
		.pipe(revReplace())
		.pipe(uglify({
			outSourceMap: true,
			mangle: false,
			compress: {
				drop_console: true
			}
		}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('public/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('bower:dev', function() {
	var jsFilter = filter(['**/*.js', '!**/bootstrap.js']);

	return gulp.src(bowerFiles({
			paths: {
				bowerDirectory: 'vendor/bower_components',
				bowerrc: '.bowerrc',
				bowerJson: 'bower.json'
			}
		}))
		.pipe(jsFilter)
		.pipe(concat('vendor.js'))
		.pipe(rename('vendor.min.js'))
		.pipe(uglify({
			mangle: false,
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('public/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('misc', function() {
	return gulp.src('frontend/misc/**')
		.pipe(gulp.dest('public/assets'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('inject', ['bower', 'script', 'style', 'partials'], function() {
	return gulp.src('frontend/index.html')
		.pipe(inject(gulp.src('public/assets/js/vendor*.js', {read: false}), {name: 'vendor', addRootSlash: false, ignorePath: 'public/'}))
		.pipe(inject(gulp.src(['public/assets/js/**/*.js', '!public/assets/js/vendor*.js', 'public/assets/css/*.css', 'public/assets/partials/**/*.js'], {read: false}), {
			addRootSlash: false,
			ignorePath: 'public/'
		}))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('inject:dev', ['bower:dev', 'script:dev', 'style:dev', 'partials:dev'], function() {
	return gulp.src('frontend/index.html')
		.pipe(inject(gulp.src('public/assets/js/vendor*.js', {read: false}), {name: 'vendor', addRootSlash: false, ignorePath: 'public/'}))
		.pipe(inject(gulp.src(['public/assets/js/**/*.js', '!public/assets/js/vendor*.js', 'public/assets/css/*.css', 'public/assets/partials/**/*.js'], {read: false}), {
			addRootSlash: false,
			ignorePath: 'public/'
		}))
		.pipe(gulp.dest('.tmp'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('index', function() {
	var jsFilter = filter('**/*.js'),
		cssFilter = filter('**/*.css');

	return gulp.src('.tmp/index.html')
		/*.pipe(jsFilter)
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe(cssFilter.restore())*/
		.pipe(gulp.dest('public'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', gulpsync.sync(['clean', ['images', 'misc'], 'inject:dev', 'index']), function() {

	browserSync({
		// server: {
		// 	baseDir: './'
		// },
		proxy: 'xy.dev' //TODO change
	});

	gulp.watch('frontend/index.html', gulpsync.sync(['inject:dev', 'index']));
	gulp.watch(['frontend/scss/**/*.scss', 'bower_components/**/*.scss'], ['style:dev']);
	gulp.watch('frontend/js/**/*.js', ['script:dev']);
	gulp.watch('frontend/img/**/*', ['images']);
	gulp.watch('frontend/partials/**/*.html', ['partials:dev']);
	gulp.watch('bower.json', ['bower:dev']);
	gulp.watch('frontend/misc/**', ['misc']);

	gulp.watch('frontend/**').on('change', browserSync.reload);
});

gulp.task('dev', gulpsync.sync(['clean', ['images', 'misc'], 'inject:dev', 'index']));

gulp.task('staging', gulpsync.sync(['clean', ['images', 'misc'], 'inject', 'index']));

gulp.task('master', gulpsync.sync(['clean', ['images', 'misc'], 'inject', 'index']));

gulp.task('default', gulpsync.sync(['clean', ['images', 'misc'], 'inject', 'index']));
