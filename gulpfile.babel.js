/**
 * Created by Brook on 2016/5/14.
 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';

gulp.task('default', ['watch']);

gulp.task('watch', ['server', 'extension'], function () {
    gulp.watch('./server/src/**/*.js', () => {
        gulp.start('server');
    });
    gulp.watch('./extension/src/**/*.js', () => {
        gulp.start('extension');
    });
});

gulp.task('server', () => {
    return gulp.src('./server/src/**')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./server/dist'));
});

gulp.task('extension', () => {
    return gulp.src('./extension/src/**')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./extension/dist'));
});