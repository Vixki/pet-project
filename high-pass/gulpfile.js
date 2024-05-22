const { src, dest, series, watch } = require('gulp');
const htmlMin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const autoprefixes = require('gulp-autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const notify = require('gulp-notify');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const clean = () => {
  return del(['dist'])
}

let prod = false;

const isProd = (done) => {
  prod = true;
  done();
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/css/**/*.css')
    .pipe(gulpif(!prod, sourcemap.init()))
    .pipe(autoprefixes({
      cascade: false,
    }))
    .pipe(gulpif(prod, cleanCSS({
      level: 2
    })))
    .pipe(gulpif(!prod, sourcemap.write()))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpif(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
};

const svgSprites = () => {
  return src('src/img/svg/**/*.svg')
    .pipe(cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/img/svg'))
};

const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
    'src/img/*.svg'
  ])
    .pipe(gulpif(prod, image()))
    .pipe(dest('dist/img'))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
};

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/resources/**', resources);
watch('src/img/', images);

exports.clean = clean;
exports.resources = resources;
exports.svgSprites = svgSprites;
exports.styles = styles;
exports.htmlMinify = htmlMinify;

exports.dev = series(clean, htmlMinify, styles, resources, images, svgSprites, watchFiles);
exports.build = series(isProd, clean, htmlMinify, styles, resources, images, svgSprites);
