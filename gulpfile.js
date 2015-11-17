var gulp = require('gulp');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('serve', ['sass'], function() {

	browserSync.init({
			server: {
					baseDir: "./"
			}
	});

	gulp.watch("./**/*.scss", ['sass']);
	gulp.watch("./*.html").on('change', browserSync.reload);

});


gulp.task('compress', function () {
	return gulp.src('./js/**/*.js')
		.pipe(minify())
		.pipe(gulp.dest('./build'));
});

gulp.task('sass', function() {
    return gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
