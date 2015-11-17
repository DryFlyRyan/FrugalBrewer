var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('default', ['compress']);

gulp.task('default', function () {
  console.log('default');
});

gulp.task('compress', function() {
  gulp.src('js/app.js')
    .pipe(minify())
    .pipe(gulp.dest('/js'));
});
