/**
 * Created by Brook on 2016/5/14.
 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';

gulp.task('default', ['watch']);

gulp.task('watch', ['server', 'extension'], function () {
    gulp.watch('./server/src/**/*', () => {
        gulp.start('server');
    });
    gulp.watch('./extension/src/**/*', () => {
        gulp.start('extension');
    });
});

gulp.task('copy_server', () => {
    return gulp.src('./server/src/**/*')
        .pipe(gulp.dest('./server/dist'))
});

gulp.task('server', ['copy_server'], () => {
    return gulp.src('./server/src/**/*.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./server/dist'));
});

gulp.task('copy_ext', () => {
    return gulp.src('./extension/src/**/*')
        .pipe(gulp.dest('./extension/dist'))
});

gulp.task('extension', ['copy_ext'], () => {
    return gulp.src([
            './extension/src/**/*.js',
            '!extension/src/lib/socket.io.js'
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./extension/dist'));
});