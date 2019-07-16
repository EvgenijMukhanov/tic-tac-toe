const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');

let isDev = true;
let isProd = !isDev;

const conf = {
	dest: './build'
};

const cssFiles = [
	'./src/css/index.css'
];

let webConfig = {
	output: {
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				},
				exclude: '/node_modules/'
			}
		]
	},
	mode: isDev ? 'development' : 'production',
	devtool: isDev ? 'eval-source-map' : 'none'
};


function html(){
	return gulp.src('./src/**/*.html')
				.pipe(gulp.dest('./build'))
				.pipe(browserSync.stream());
}

function scss(){
	return gulp.src('./src/scss/index.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/css'));
}

function styles(){
	return gulp.src(cssFiles)
				.pipe(concat('index.css'))
				.pipe(autoprefixer({
					browsers: ['> 0.01%'],
					cascade: false
				}))
				.pipe(gulpif(isProd, cleanCSS({
					level: 2
				})))
				.pipe(gulp.dest(conf.dest + '/css'))
				.pipe(browserSync.stream());
}

function scripts(){
	return gulp.src('./src/js/index.js')
				.pipe(webpack(webConfig))
				.pipe(gulp.dest(conf.dest + '/js'))
				.pipe(browserSync.stream());
}

function images(){
	return gulp.src('./src/img/**/*')
				.pipe(gulp.dest(conf.dest + '/img'));
}

function watch(){
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
	let StylesScss = gulp.series(scss, styles);
	gulp.watch('./src/scss/**/*.scss', StylesScss);
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/**/*.html', html);

}

function clean(){
	return del(['build/*'])
}

let StylesScss = gulp.series(scss, styles);

// gulp.task('styles', styles);
gulp.task('scss', StylesScss);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

let build = gulp.series(clean,
				gulp.parallel(html, StylesScss, scripts, images)
			);
gulp.task('build', build);
gulp.task('dev', gulp.series('build', 'watch'));
