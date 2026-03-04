const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

// SASS/postCSS processing removed since not used any more

const browserSync = require("browser-sync");

const fs = require('fs');//ファイル同期
const dataJSON = JSON.parse(fs.readFileSync('./src/_data.json'));
const replaceJSON = JSON.parse(fs.readFileSync('./src/_replace.json'));

//▽EJSコンパイル
function compileHTML() {
  return gulp
  .src([
        './src/ejs/page/*.ejs' ,
        './src/ejs/page/*/*.ejs' ,
        './src/ejs/page/*/*/*.ejs' ,
        './src/ejs/page/*/*/*/*.ejs' ,
        './src/ejs/page/*/*/*/*/*.ejs' ,
        '!' + './src/ejs/page/*_php.ejs' ,
        '!' + './src/ejs/page/*/*_php.ejs',
        '!' + './src/ejs/page/*/*/*_php.ejs',
        '!' + './src/ejs/page/*/*/*/*_php.ejs',
        '!' + './src/ejs/page/*/*/*/*/*_php.ejs'
      ])
  .pipe(ejs({ dataJSON , replaceJSON }))
  .pipe(rename({ extname: '.html' }))
  .pipe(gulp.dest('./dest/'))
}

//▽phpコンパイル
function compilePHP() {
  return gulp
  .src([
        './src/ejs/page/*_php.ejs' ,
        './src/ejs/page/*/*_php.ejs',
        './src/ejs/page/*/*/*_php.ejs',
		'./src/ejs/page/*/*/*/*_php.ejs',
		'./src/ejs/page/*/*/*/*/*_php.ejs'
      ])
  .pipe(ejs({ dataJSON , replaceJSON }))
  .pipe(rename(
    function (path) {
      path.basename = path.basename.replace( "_php" , "" );
      path.extname = ".php"
    }
  ))
  .pipe(gulp.dest('./dest/'))
}
 
// SASS compilation task removed because Sass is not being used any more

//▽ローカルサーバ�E立ち上げ
const browserSyncFunc = () => {
  browserSync({
    server: './dest'
  });
}
//▽リローチE
const browserSyncReload = (done) => {
	browserSync.reload();
	done();
}
//▽ファイルの変更時にbrowserSyncReloadする
const watchFiles = () => {
	gulp.watch('./src/ejs/', gulp.series(compileHTML, compilePHP, browserSyncReload))
}

//▽タスクの実衁E
exports.default = gulp.series(
  gulp.parallel(compileHTML, compilePHP),
  gulp.parallel(watchFiles, browserSyncFunc)
);
