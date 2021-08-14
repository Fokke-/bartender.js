const gulp = require('gulp')
const sizereport = require('gulp-sizereport')
const plumber = require('gulp-plumber')
const beeper = require('beeper')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const terser = require('gulp-terser')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const sasslint = require('gulp-sass-lint')
const footer = require('gulp-footer')
const rename = require('gulp-rename')

// Configuration
const config = {
  paths: {
    base: './',
    css: {
      src: './scss/',
      dist: './dist/',
    },
    js: {
      src: './src/',
      dist: './dist/',
    },
  },
  sizereport: {
    gzip: true,
  },
  browserSync: {
    server: {
      baseDir: './',
      directory: true,
    },
    online: true,
  },
  babel: {
    presets: [
      '@babel/env',
    ],
    plugins: [
      '@babel/plugin-transform-object-assign',
      '@babel/plugin-transform-parameters',
    ],
  },
}

// Error handler
function plumbError () {
  return plumber({
    errorHandler: function (err) {
      notify.onError({
        templateOptions: {
          date: new Date(),
        },
        title: 'Gulp error in ' + err.plugin,
        message: err.formatted,
      })(err)
      beeper()
      this.emit('end')
    },
  })
}

// Init browserSync
const browserSyncInit = () => {
  browserSync.init(config.browserSync)
}

// Reload browsers
const browserSyncReload = (done) => {
  browserSync.reload()

  done()
}

// Task: CSS
const css = () => {
  return gulp
    .src(config.paths.css.src + '*.scss')
    .pipe(gulp.dest(config.paths.css.dist))
    .pipe(plumbError())
    .pipe(rename('bartender.min.css'))
    .pipe(sourcemaps.init())
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.css.dist))
}

// Task: JS
const js = () => {
  return gulp
    .src(config.paths.js.src + 'bartender.js')
    .pipe(plumbError())
    .pipe(rename('bartender.min.js'))
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.js.dist))
}

// Task: JS Module
const jsModule = () => {
  return gulp
    .src(config.paths.js.src + 'bartender.js')
    .pipe(plumbError())
    .pipe(rename('bartender.module.js'))
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(footer('\nexport default Bartender'))
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.js.dist))
}

// Task: JS compatibility build
const jsCompat = () => {
  return gulp
    .src(config.paths.js.src + 'bartender.js')
    .pipe(plumbError())
    .pipe(rename('bartender.compat.js'))
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel(config.babel))
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.js.dist))
}

// Watch
const watch = () => {
  gulp.watch(
    [
      config.paths.css.src + '**/*.scss',
    ],
    gulp.series(css, browserSyncReload)
  )

  gulp.watch(
    [
      config.paths.js.src + '**/*.js',
    ],
    gulp.series(js, jsModule, jsCompat, browserSyncReload)
  )

  gulp.watch(
    [
      config.paths.base + '**/*.html',
    ],
    gulp.series(browserSyncReload))
}

// Task: Dev
const dev = gulp.parallel(browserSyncInit, watch)

// Exports
exports.css = css
exports.js = js
exports.jsModule = jsModule
exports.jsCompat = jsCompat
exports.dev = dev
exports.default = gulp.series(css, js, jsModule, jsCompat, dev)
