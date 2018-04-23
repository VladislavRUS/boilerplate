const config = require('./gulp/config.js');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const wait = require('gulp-wait');

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
    .pipe(wait(500))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.js.dest))
);

gulp.task('js:prod', () =>
    gulp.src(config.js.src)
    .pipe(concat('main.js'))
    .pipe(minify({
        ext:{
            min:'.js'
        }
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config.js.prodDest))
);

gulp.task('scss', () =>
    gulp.src(config.scss.src)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.scss.dest))
    .pipe(browserSync.stream())
);

gulp.task('scss:prod', () =>
    gulp.src(config.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.scss.prodDest))
    .pipe(browserSync.stream())
);

gulp.task('html:prod', () => 
    gulp.src(config.html.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.html.prodDest))
);

gulp.task('watch', () => {
    gulp.watch(config.scss.watch, ['scss']);
    gulp.watch(config.js.watch, ['js']);
    gulp.watch(config.html.watch, browserSync.reload);
});

gulp.task('assets:prod', () => 
    gulp.src(config.assets.src)
    .pipe(gulp.dest(config.assets.prodDest))
);

gulp.task('images:prod', () =>
    gulp.src(config.images.src)
    .pipe(imagemin({
        progressive: true,
        optimizationLevel: 5,
    }))
    .pipe(gulp.dest(file => file.base))
);

gulp.task('prod', (done) => 
    runSequence(['js:prod', 'scss:prod', 'html:prod'], 'assets:prod', 'images:prod', done)
);

gulp.task('default', ['js', 'scss', 'watch', 'browser-sync']);