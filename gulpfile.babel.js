/**
 * Created by Brook on 2016/5/14.
 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import clean from 'gulp-clean';

gulp.task('default', ['watch']);

gulp.task('watch', ['server', 'extensionChrome', 'extensionFirefox'], function () {
    gulp.watch('./server/src/**/*', () => {
        gulp.start('server');
    });
    gulp.watch('./extensionChrome/src/**/*', () => {
        gulp.start('extensionChrome');
    });
    gulp.watch('./extensionFirefox/src/**/*', () => {
        gulp.start('extensionFirefox');
    });
});

gulp.task('server', ['copyServer'], () => {
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

gulp.task('copyServer', ['cleanServer'], () => {
    return gulp.src('./server/src/**/*')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./server/dist'))
});

gulp.task('cleanServer', () => {
    return gulp.src('./server/dist/*', { read: false })
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(clean());
});

gulp.task('extensionChrome', ['copyChrome'], () => {
    return gulp.src([
            './extensionChrome/src/**/*.js',
            '!extensionChrome/src/lib/socket.io.js'
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./extensionChrome/dist'));
});

gulp.task('copyChrome', ['cleanChrome'], () => {
    return gulp.src('./extensionChrome/src/**/*')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./extensionChrome/dist'))
});

gulp.task('cleanChrome', () => {
    return gulp.src('./extensionChrome/dist/*', { read: false })
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(clean());
});

gulp.task('extensionFirefox', ['copyFirefox'], () => {
    return gulp.src([
            './extensionFirefox/src/**/*.js',
            '!extensionFirefox/src/lib/socket.io.js'
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(gulp.dest('./extensionFirefox/dist'));
});

gulp.task('copyFirefox', ['cleanFirefox'], () => {
    return gulp.src('./extensionFirefox/src/**/*')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./extensionFirefox/dist'))
});

gulp.task('cleanFirefox', () => {
    return gulp.src('./extensionFirefox/dist/*', { read: false })
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(clean());
});