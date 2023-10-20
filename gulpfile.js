
const { src, dest, task, series, parallel, watch, lastRun } = require('gulp');
const { resolve } = require("path");
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');

const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');//反向代理

const del = require('del');
const rename = require('gulp-rename');

const rev = require('gulp-rev-append');

//NODE_ENV
let env = process.env.NODE_ENV;

let pro = env === 'production',
    dev = env === 'development';

task('html', function (cb) {

    let opt = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    src('./src/*.html')
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulpif(pro, htmlmin(opt)))
    .pipe(dest('dist/'))
    .pipe(connect.reload());
    cb();

});

task('lib', function (cb) {
  src('src/lib/*')
  .pipe(dest('dist/lib'));
  cb();
})

task('config', function (cb) {
  let url = 'src/config/server.js';

  if(pro) url="src/config/server-prod.js";
  if(dev) url="src/config/server-test.js";

  src(url)
  .pipe(rename("server.js"))
  .pipe(dest('dist/config'));
  cb();
})

task('image_min', function (cb) {
    src('src/imgs/**')
    .pipe(plumber())
    .pipe(dest('dist/imgs'));
    cb();
});

task('css', function (cb) {

    src('src/css/*.css')
    .pipe(plumber())
    .pipe(gulpif(pro, cleanCSS()))
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
    cb();

});


task("js_min", function (cb) {

  src('src/js/*.js')
  .pipe(plumber())
  //.pipe(gulpif(pro, uglify()))
  .pipe(dest('dist/js'))
  .pipe(connect.reload());
  cb();


});

task('watch', function(cb){//监控

  let watcher = watch(
    ['./src/js/*.js','./src/css/*.css','./src/*.html'],
    {events:['change','add','unlink']},
    parallel('css','js_min','html')
  );

  watcher.on('change', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was changed
      ------------------------
      `);
  });

  watcher.on('add', function(path, stats) {
    console.log(`
      ----------------------
      File ${path} was added
      ----------------------
      `);
  });

  watcher.on('unlink', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was removed
      ------------------------
      `);
  });

  //watcher.close();
  cb();
});


task('clean', () => {
  return del('./dist').then(() => {
    console.log(`
        -----------------------------
          clean tasks are successful
        -----------------------------`);
  }).catch((e) =>{
    console.log(e);
  })
});


//生产环境
task('build', series('clean', parallel('config','lib','css','js_min','image_min'),'html',function(cb){
  console.log(`
      -----------------------------
        build tasks are successful
      -----------------------------`);
      cb();
}));

//开发环境
task('server',series('clean','watch',parallel('config','lib','css','js_min','image_min'),'html',function(){
    connect.server({
        root: 'dist',
        host:'127.0.0.1',
        port: 9000,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: "http://10.10.10.10:9000",
                    changeOrigin:true,
                    headers: {
                         "Connection": "keep-alive"
                     },
                    ws: true,
                    pathRewrite: {
                        '^/api' : ''
                    }
                })
            ]
        }

    });
    console.log(`
        -----------------------------
          server tasks are successful
        -----------------------------`);
}));

task('default', () => {
  console.log(
   `
  Build Setup
    开发环境： npm run start
    生产环境： npm run build
    `
  )
})
