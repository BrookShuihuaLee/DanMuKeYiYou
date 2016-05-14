/**
 * Created by Brook on 2016/5/14.
 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';

gulp.task('default', ['server', 'extension']);

gulp.task('server', () => {
    return gulp.src('./server/src/**')
        .pipe(watch('./server/src/**'))
        .pipe(babel())
        .pipe(gulp.dest('./server/dist'));
});

gulp.task('extension', () => {
    return gulp.src('./extension/src/**')
        .pipe(watch('./extension/src/**'))
        .pipe(babel())
        .pipe(gulp.dest('./extension/dist'));
});