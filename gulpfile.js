const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');

const config = {
    js: {
        src: './statc/scripts/js/**/*.js',
        dest: './static/scripts/'
    },
    scss: {
        src: './static/styles/scss/main.scss',
        dest: './static/styles/'
    }
}

// Static server
gulp.task('browser-sync', () =>
    browserSync.init({
        server: {
            baseDir: "./static"
        }
    })
);

gulp.task('js', () =>
    gulp.src(config.js.src)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.js.dest))
);

gulp.task('sass', () =>
    gulp.src(config.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.scss.dest))
    .pipe(browserSync.stream())
);

gulp.task('watch', () => {
    gulp.watch('./static/styles/scss/**/*.scss', ['sass']);
    gulp.watch('./static/scripts/**/*.js', ['js']);
    gulp.watch('./static/index.html', browserSync.reload);
});

gulp.task('default', ['sass', 'js', 'watch', 'browser-sync']);