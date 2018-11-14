let gulp = require('gulp'),

  sass = require('gulp-sass'),
  less = require('gulp-less'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  uglifyJs = require('gulp-uglifyes'),
  autoPrefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  cssMin = require('gulp-csso'),
  image = require('gulp-image'),
  delFiles = require('del'),
  bs = require('browser-sync');
  wiredep = require('wiredep').stream;


gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe(useref())
    /*.pipe(gulpif('*.js', uglifyJs()))
    .pipe(gulpif('*.css', cssMin()))*/
    .pipe(gulp.dest('dist'));
});

gulp.task('bower', () => {
  gulp.src('./app/*.html')
    .pipe(wiredep({
      direction: 'app/components'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('sass', () => {
  return gulp.src('app/css/**/*.scss')
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('less', () => {
  return gulp.src('app/css/!**/!*.less')
    .pipe(less())
    .pipe(autoPrefixer())
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js:es6', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe(gulp.dest('dist/scripts'))
    .pipe(uglifyJs())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('json', () => {
  return gulp.src('app/scripts/*.json')
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('image-cart', () => {
  return gulp.src('app/img/cart/*.+(jpg|png|gif|svg)')
    .pipe(image())
    .pipe(gulp.dest('dist/img/cart'));
});

gulp.task('image-product', () => {
  return gulp.src('app/img/product/*.+(jpg|png|gif|svg)')
    .pipe(image())
    .pipe(gulp.dest('dist/img/product'));
});

gulp.task('image', () => {
  return gulp.src('app/img/*.+(jpg|png|gif|svg)')
    .pipe(image())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', () => {
  return delFiles(['dist/**', '!dist']);
});

gulp.task('server', () => {
  return bs({
    browser: ['chrome'],
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('html:watch', () => {
  return gulp.watch('./bower.json', gulp.series('bower', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('bower:watch', () => {
  return gulp.watch('app/*.html', gulp.series('html', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('sass:watch', () => {
  return gulp.watch('app/css/**/*.scss', gulp.series('sass', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('less:watch', () => {
  return gulp.watch('app/css/!**!/!*.less', gulp.series('less', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('js:watch', () => {
  return gulp.watch('app/scripts/!**/!*.js', gulp.series('js:es6', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('json:watch', () => {
  return gulp.watch('app/scripts/*.json', gulp.series('json', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('default', gulp.series('clean',
  gulp.parallel('html', 'bower', 'sass', 'less', 'js:es6', 'json', 'image-cart', 'image-product', 'image',
    'server', 'html:watch', 'bower:watch', 'sass:watch', 'less:watch', 'js:watch', 'json:watch')));