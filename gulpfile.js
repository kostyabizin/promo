const gulp          = require('gulp');
const browserSync   = require('browser-sync');
const sass          = require('gulp-sass')(require('sass'));
const cleanCSS      = require('gulp-clean-css');
const autoprefixer  = require('gulp-autoprefixer');
const rename        = require("gulp-rename");
const fileinclude   = require('gulp-file-include');
const concatCss     = require('gulp-concat-css');

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/**/*.css").on('change', browserSync.reload);
});

gulp.task('styles', function(){
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({prefix: "", suffix: ".min"}))
        .pipe(autoprefixer())
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
    });

gulp.task('fileinclude', function(){
    return gulp.src('src/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('./')) 
    });

gulp.task('cssinclude', function () {
    return gulp.src('src/css/style.css')
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
  });

gulp.task('watch', function(){
    gulp.watch('src/sass/**/*.sass', gulp.parallel('styles'));
    gulp.watch('src/**/*.css', gulp.parallel('cssinclude'));
    gulp.watch('src/**/*.html', gulp.parallel('fileinclude'));
});


gulp.task('default', gulp.parallel('server', 'styles', 'watch', 'fileinclude', 'cssinclude'));