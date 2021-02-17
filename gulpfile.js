const config = require('./package.json').config
const gulp = require('gulp')
const sizereport = require('gulp-sizereport')
const plumber = require('gulp-plumber')
const beeper = require('beeper')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const eslint = require('gulp-eslint')
const sasslint = require('gulp-sass-lint')

// Error handler
function plumbError () {
  return plumber({
    errorHandler: function (err) {
      notify.onError({
        templateOptions: {
          date: new Date()
        },
        title: 'Gulp error in ' + err.plugin,
        message: err.formatted
      })(err)
      beeper()
      this.emit('end')
    }
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
  return gulp.src(config.paths.css.src + '*.scss')
    .pipe(plumbError())
    .pipe(sourcemaps.init())
    .pipe(sasslint(config.sasslint))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.css.dist))
    .pipe(gulp.dest(config.paths.base + 'demo/')
    )
}

// Task: JS
const js = () => {
  return gulp.src(config.paths.js.src + '*.js')
    .pipe(plumbError())
    .pipe(sourcemaps.init())
    .pipe(eslint(config.eslint))
    .pipe(eslint.format())
    // .pipe(babel(config.babel))
    .pipe(terser(config.terser))
    .pipe(sourcemaps.write('.'))
    .pipe(sizereport(config.sizereport))
    .pipe(gulp.dest(config.paths.js.dist))
    .pipe(gulp.dest(config.paths.base + 'demo/')
    )
}

// Watch
const watch = () => {
  gulp.watch([
    config.paths.css.src + '**/*.scss',
  ], gulp.series(css, browserSyncReload))

  gulp.watch([
    config.paths.js.src + '**/*.js',
  ], gulp.series(js, browserSyncReload))

  gulp.watch([
    config.paths.base + '**/*.html',
  ], gulp.series(browserSyncReload))
}

// Task: Dev
const dev = gulp.parallel(browserSyncInit, watch)

// Exports
exports.css = css
exports.js = js
exports.dev = dev
exports.default = dev
