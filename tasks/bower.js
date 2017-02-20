import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('bower', () => {
  return gulp.src('app/bower_components/**/*')
    .pipe(gulp.dest(`dist/${args.vendor}/bower_components`))
    .pipe(gulpif(args.watch, livereload()));
});
