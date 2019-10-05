// --- 載入套件 --------------------------------------------------
// --- 載入套件 | 最重要 der gulp
var gulp = require('gulp')
// --- 載入套件 | 冠有 gulp 名，有了 $，就都不用進來惹
 var $ = require('gulp-load-plugins')();
// --- 載入套件 | 沒錢百事哀，還是要自己過來載入，不然沒人看得到
 var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var minimist = require('minimist')
var gulpSequence = require('gulp-sequence') // 特例
 // --- 用不到的
 // var mainBowerFiles = require('main-bower-files')



// --- 變數 ------------------------------------------------------
// --- 變數 | 開發 or 生產環境，minimist, if
var envOptions = {
  string: 'env',
  default: { env: 'develop' }
}
var options = minimist(process.argv.slice(2), envOptions)
console.log(options)
var envIsPro = options.env === 'production'



// --- 手動區 ------------------------------------------------------
// --- 測試用
 gulp.task('copyHTML', function () {
  return gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./public'))
})
// --- 複製 | BS 的 _variables
gulp.task('cp-bs-var', function () {
  return gulp.src('./node_modules/bootstrap/scss/_variables.scss')
    .pipe(gulp.dest('./source/stylesheets/helper/'))
})



// --- 自動區 -------------------------------------------------------
// --- clean | 把之前編譯過、暫存的檔案都砍掉 
gulp.task('clean', () => {
  return gulp.src(['./public', './.tmp'], { read: false })
    .pipe($.clean());
});
// --- copy | 把檔案從 ./source 複製到 ./public
gulp.task('copy', () => {
  gulp
    .src(['./source/**/**', '!source/stylesheets/**/**', '!source/**/*.ejs', '!source/**/*.html'])
    .pipe(gulp.dest('./public/'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});


// --- HTML | YAML-layout
gulp.task('YAML-layout', () => {
  return gulp
    .src(['./source/**/*.ejs', './source/**/*.html'])
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      }),
    )
    .pipe(gulp.dest('./public'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});
// --- HTML | 防噴錯 > jade-html & 縮一縮 (if-pro) > 送出去 > 看網頁
 gulp.task('jade', function () {
  // var YOUR_LOCALS = {};
  gulp.src('./source/**/*.jade')
    .pipe($.plumber())
    .pipe($.if(envIsPro, $.jade(), $.jade({ pretty: true })))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});


// --- CSS | 防噴錯 > 建地圖 > sass-css > 加前綴 > 縮一縮 (if-pro) > 寫地圖 > 送出去 > 看網頁
 gulp.task('sass', () => {

  // PostCSS AutoPrefixer
  const processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    }),
  ];

  return gulp
    .src(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'nested',
        // includePaths: ['./node_modules/bootstrap/scss'],
      }).on('error', $.sass.logError),
    )
    .pipe($.postcss(processors))
    .pipe($.if(options.env === 'production', $.minifyCss())) // 假設開發環境則壓縮 CSS
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});


// --- JS | verdorJS
gulp.task('vendorJS', () => {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.min.js',
      // './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
    .pipe($.concat('vendor.js'))
    // .pipe($.if(envIsPro, $.uglify()))
    .pipe(gulp.dest('./public/javascripts'));
});
// --- JS | babel 防噴錯 > 看地圖 > babel-js > 包一包 > 縮一縮 (if-pro) > 印地圖 > 送出去 > 看網頁  
// --- JS | need gulp-babel, gulp-gulify
gulp.task('babel', function () {
  return gulp.src('./source/javascripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.concat('all.js'))
    .pipe($.if(envIsPro,
      $.uglify({
        compress: {
          drop_console: true
        }
      })
    ))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/javascripts'))
    .pipe(browserSync.stream());
});


// --- 圖片 | imageMin, need gulp-imagemin
gulp.task('imageMin', () => {
  gulp.src('./source/images/*')
    .pipe($.if(envIsPro, $.imagemin()))
    .pipe(gulp.dest('./public/images'))
    .pipe(browserSync.stream())
});



// --- 伺服 | Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./public",
      reloadDebounce: 2000
    }
  });
});
// --- 監控 | big brother watch you
gulp.task('watch', () => {
  gulp.watch(['./source/**/*.html', './source/**/*.ejs'], ['YAML-layout'])
  // gulp.watch(['./source/**/*.jade', './source/**/*.pug'], ['jade'])
  gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']);
  gulp.watch('./source/javascripts/**/*.js', ['babel']);
})
// --- 監控 | gulp-watch 的版本
 gulp.task('gWatch', function () {

  w(['./source/**/*.html', './source/**/*.ejs'], ['YAML-layout'])
  w(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass'])
  w('./source/javascripts/**/*.js', ['babel']);
  w('./source/images/*', 'imageMin')

  function w(path, task) {
    $.watch(path, function () {
      gulp.start(task)
    })
  }

})



// --- 指令區 -------------------------------------------------------
// --- 開發用 | gulp | gulp --env production
gulp.task('default', ['imageMin', 'babel', 'vendorJS', 'sass', 'YAML-layout', 'browser-sync', 'watch'])
// --- 輸出用 | gulp build | gulp build --env production
gulp.task('sequence', gulpSequence('clean', 'copy', 'sass', 'vendorJS', 'babel', 'YAML-layout', 'imageMin'));
gulp.task('build', ['sequence'])
// --- 上傳用 | gulp deploy
gulp.task('deploy', () => {
  return gulp.src('./public/**/*').pipe($.ghPages());
}); 
