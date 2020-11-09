/*
Written by wdaonngg@gmail.com in 2020-06-09

posthtml
postcss
babel
*/

const { src, dest, task, series, parallel, watch, lastRun } = require('gulp');
const { resolve } = require("path");
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');

const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');//反向代理

const fileinclude = require('gulp-file-include');
const del = require('del');
const babel = require("gulp-babel");

//postcss
const postcss = require('gulp-postcss');
const ppEnv = require('postcss-preset-env');
const autoprefixer  = require('autoprefixer');
const cssnano = require('cssnano');

//posthtml
const posthtml = require("gulp-posthtml");
const posthtmlcm = require("posthtml-css-modules");
const pxtorem = require('postcss-pxtorem');
const tap = require('gulp-tap');
const modules = require('postcss-modules');

//browserify
const browserify = require('browserify');
const source = require('vinyl-source-stream');
// const buffer = require('vinyl-buffer');
const glob = require('glob');
const rename = require('gulp-rename');

const concat = require('gulp-concat');


// NODE_ENV
let env = process.env.NODE_ENV;

let pro = env === 'production',
    dev = env === 'development';

task('scripts', function(cb) {

  return src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(dest('./dist/'));
    cb()

});

task('html', function (cb) {

    let plugins  = [
      posthtmlcm('./src/css/htl.css.json')
     ];

    let options = {}

    let opt = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    src('./src/*.html')
    .pipe(plumber())
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
    // .pipe(posthtml(plugins, options))
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
    src('src/imgs/*')
    .pipe(plumber())
    .pipe(gulpif(pro, imagemin()))
    .pipe(dest('dist/imgs'));
    cb();
});

task('css', function (cb) {

  var processors = [
     ppEnv({//Can I Use
      autoprefixer: { grid: true },
      stage: 1,//0 1 2 3
      features: {
        'nesting-rules': true
      }
    }),
    // modules({
    //   getJSON: function (cssFileName, json, outputFileName) {
    //     var path = require("path");
    //     var cssName = path.basename(cssFileName, ".css");
    //     var jsonFileName = path.resolve("./build/" + cssName + ".json");
    //     fs.writeFileSync(jsonFileName, JSON.stringify(json));
    //   },
    // })
    pxtorem({
      replace: false
     }),
    //cssnano
   ];

    src('src/css/*.css')
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(gulpif(pro, cleanCSS()))
    .pipe(dest('dist/css'))
    cb();

});

//browserify
task("js_bro", function (cb) {

  var files = glob.sync("./src/js/*.js");
  files.map(function(entry) {

    return browserify({ entries: entry })
        .transform("babelify")
        .bundle()
        .pipe(source(entry))
        .pipe(rename(function(path){
          return{
              extname: '.js',
              basename:path.basename,
              dirname: "./",
          }
        }))
        .pipe(gulpif(pro, uglify()))
        .pipe(dest('./dist/js/'));
  });

  cb()

});

task('watch', function(cb){//监控

  let watcher = watch(
    ['./src/js/*.js','./src/css/*.css','./src/*.html','./src/include/*.html'],
    {events:['change','add','unlink']},
    parallel('css','js_bro','html')
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
task('build', series('clean', parallel('config','lib','css','js_bro','image_min'),'html',function(cb){
  console.log(`
      -----------------------------
        build tasks are successful
      -----------------------------`);
      cb();
}));

//开发环境
task('server',series('clean','watch',parallel('config','lib','css','js_bro','image_min'),'html',function(){
    connect.server({
        root: 'dist',
        host:'192.168.1.77',
        port: 9000,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'http://192.168.23.239:8080/',
                    changeOrigin:true,
                    headers: {
                         "Connection": "keep-alive"
                     },
                    //ws: true,
                    pathRewrite: {
                        '^/api' : ''
                    },
                    router: {
                      // 'integration.localhost:3000' : 'http://localhost:8001',  // host only
                      // 'staging.localhost:3000'     : 'http://localhost:8002',  // host only
                      // 'localhost:3000/api'         : 'http://localhost:8003',  // host + path
                      // '/rest'                      : 'http://localhost:8004'   // path only
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
