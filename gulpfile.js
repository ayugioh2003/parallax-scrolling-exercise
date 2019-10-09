const gulp = require("gulp")
const del = require("del")
const autoprefixer = require("autoprefixer")
const browserSync = require("browser-sync").create()
const minimist = require("minimist")
const log = require("fancy-log")
const ejsLint = require('ejs-lint')

const $ = require("gulp-load-plugins")()

sass.compiler = require('node-sass');


/*****************************************************
 * 變數 block
 *****************************************************/
var envOptions = {
  string: "env",
  default: { env: "develop" }
}
var options = minimist(process.argv.slice(2), envOptions) // process.argv = [node, gulp.js, arg1, arg2, ...]
var envIsPro =
  options.env === "production" || options.env == "pro" || options.env == "prod"

exports.envNow = function envNow(cb) {
  console.log(`env now is: ${options.env}, so envIsPro is ${envIsPro}`)
  console.log(options)
  cb()
}

const PATH = {
  ejs: {
    src: [
      // "./source/**/*.html",
      "./source/templates/**.ejs",
      "!./templates/**/_*.ejs"
    ],
    dest: "./public"
  },
  css: {
    src: ["./source/stylesheets/**/*.sass", "./source/stylesheets/**/*.scss"],
    dest: "./public/stylesheets"
  },
  js: {
    src: ["./source/javascripts/**/*.js"],
    dest: "./public/javascripts"
  },
  img: {
    src: "./source/images/*",
    dest: "./public/images"
  },
  vendorjs: {
    src: [
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/smooth-scroll/dist/smooth-scroll.polyfills.min.js"
      // "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    ],
    dest: "./public/javascripts"
  },
  bs: {
    dir_src: "./node_modules/bootstrap/scss",
    helper_src: "./node_module/bootstrap/scss/_variables.scss",
    helper_dest: ".source/stylesheets/hellper/"
  },
  others: {
    src: [
      "./source/**/**",
      "!source/javascripts/**/**",
      "!source/stylesheets/**/**",
      "!source/**/*.ejs",
      "!source/**/*.pug",
      "!source/**/*.jade",
      "!source/**/*.html"
    ],
    dest: "./public"
  }
}

/*****************************************************
 * Hello gulp block
 *****************************************************/
gulp.task("hello3", function(cb) {
  console.log("hello gulp 3.9.1")
  cb()
})

function hello4CommonJS(cb) {
  console.log("hello gulp 4.0, CommonJS format")
  cb()
}
exports.hello4CommonJS = hello4CommonJS

// export function hello4ES6(cb) {
//   console.log("hello gulp 4.0, ES6 format")
//   cb()
// }

/*****************************************************
 * 複製檔案 block
 *****************************************************/
function copyHTML() {
  return gulp.src("./source/**/*.html").pipe(gulp.dest("./public"))
}
exports.copyHTML = copyHTML

function copyBsHelper() {
  return gulp.src(PATH.bs.helper_src).pipe(gulp.dest(PATH.bs.helper_dest))
}
exports.copyBsHelper = copyBsHelper

function copy() {
  return gulp.src(PATH.others.src).pipe(gulp.dest(PATH.others.dest))
}
exports.copy = copy

/*****************************************************
 * 清除暫存 block
 *****************************************************/
function clean() {
  return del(["./public", "./.tmp"])
}
exports.clean = clean

function cleanEJS() {
  return del("./public/*.ejs")
}

/*****************************************************
 * HTML 處理 block
 *****************************************************/
function ejs() {
  return gulp
    .src(PATH.ejs.src)
    .pipe($.plumber())
    .pipe($.frontMatter({property: 'data', remove: true}))
    .pipe($.layout(function(file){return file.data}))
    .pipe(
      $.ejs().on('error', log)
    )
    .pipe($.rename({ extname: '.html'}))
    .pipe($.if(envIsPro, $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(PATH.ejs.dest))
    .pipe($.if(!envIsPro, browserSync.stream()))
}
exports.ejs = ejs

function ejslint() {
  return gulp.src(PATH.ejs.src)
    .pipe(ejsLint())
}
exports.ejslint = ejslint

/*****************************************************
 * CSS 處理 block
 *****************************************************/
function sass() {
  const processors = [autoprefixer()]

  return gulp
    .src(PATH.css.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: "nested",
        includePaths: PATH.bs.dir_src
      }).on("error", $.sass.logError)
    )
    .pipe($.postcss(processors))
    .pipe($.if(envIsPro, $.cleanCss()))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(PATH.css.dest))
    .pipe($.if(!envIsPro, browserSync.stream()))
}
exports.sass = sass

/*****************************************************
 *  JS 處理 block
 *****************************************************/
function vendorJS() {
  return gulp
    .src(PATH.vendorjs.src)
    .pipe($.concat("vendor.js"))
    .pipe(gulp.dest(PATH.vendorjs.dest))
}
exports.vendorJS = vendorJS

function babel() {
  return gulp
    .src(PATH.js.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.babel({
        presets: ["@babel/env"]
      })
    )
    .pipe($.concat("all.js"))
    .pipe(
      $.if(
        envIsPro,
        $.uglify({
          compress: {
            drop_console: true
          }
        })
      )
    )
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(PATH.js.dest))
    .pipe($.if(!envIsPro, browserSync.stream()))
}
exports.babel = babel

/*****************************************************
 *  圖片處理 block
 *****************************************************/
function imageMin() {
  return gulp
    .src(PATH.img.src)
    .pipe($.if(envIsPro, $.imagemin()))
    .pipe(gulp.dest(PATH.img.dest))
    .pipe($.if(envIsPro, browserSync.stream()))
}
exports.imageMin = imageMin

/*****************************************************
 *  實時預覽 block
 *****************************************************/
function browser() {
  browserSync.init({
    server: {
      baseDir: "./public",
      reloadDebounce: 2000
    }
  })
}
exports.browser = browser

function watch() {
  gulp.watch(PATH.ejs.src, ejs)
  // gulp.watch(['./source/**/*.jade', './source/**/*.pug'], pug)
  gulp.watch(PATH.css.src, sass)
  gulp.watch(PATH.js.src, babel)
  console.log("watching file ~")
}
exports.watch = watch

/*****************************************************
 *  指令 block
 *****************************************************/
exports.default = gulp.parallel(
  imageMin,
  babel,
  vendorJS,
  sass,
  ejs,
  browser,
  watch
)

const build = gulp.series(
  gulp.series(clean, copy),
  gulp.parallel(vendorJS, babel, sass, ejs, imageMin),
  cleanEJS
)
exports.build = build

// = gulp build --env production
function setEnvPro(cb) {
  envIsPro = true
  cb()
}
exports.buildPro = gulp.series(setEnvPro, build)

function deploy() {
  return gulp.src("./public/**/*").pipe($.ghPages())
}
exports.deploy = deploy
