
### AMD

```javascript
define(['jquery'] , function ($) {
    return function () {};
});
```
#### useref
```

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

```

```

task("browserify", function () {
    var b = browserify({
        entries: "./src/js/index.js",
        debug: true
    });

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./app/js/"));
});
```

#### factor-bundle
```
# npm install factor-bundle

var browserify = require('browserify');
var fs = require('fs');

var files = [ './files/x.js', './files/y.js' ];
var b = browserify(files);
b.plugin('factor-bundle', { outputs: [ 'bundle/x.js', 'bundle/y.js' ] });
b.bundle().pipe(fs.createWriteStream('bundle/common.js'));
```

```
var browserify = require('browserify');
var concat = require('concat-stream');

var files = [ './files/x.js', './files/y.js' ];
var b = browserify(files);

b.plugin('factor-bundle', { outputs: [ write('x'), write('y') ] });
b.bundle().pipe(write('common'));

function write (name) {
    return concat(function (body) {
        console.log('// ----- ' + name + ' -----');
        console.log(body.toString('utf8'));
    });
}
```

#### 多个文件
```
var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream');

gulp.task('default', function(done) {
    glob('./app/main-**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist'));
            });
        es.merge(tasks).on('end', done);
    })
});
```


### browserify

```javascript
//browserify
task("browserify", function (cb) {
  var files = glob.sync("./src/js/*.js");

  files.map(function(entry) {

    return browserify({ entries: entry })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
            // extname: '.bundle.js',
            dirname: "./",
        }))
        .pipe(dest('./dist/js/'));
  });

  cb()

});
```

### css modules
```
function getJSONFromCssModules(cssFileName, json) {
  const cssName       = path.basename(cssFileName, '.css');
  const jsonFileName  = path.resolve('./build', `${ cssName }.json`);
  fs.writeFileSync(jsonFileName, JSON.stringify(json));
}

function getClass(module, className) {
  const moduleFileName  = path.resolve('./build', `${ module }.json`);
  const classNames      = fs.readFileSync(moduleFileName).toString();
  return JSON.parse(classNames)[className];
}

gulp.task('css', () => {
  return gulp.src('./css/styles.css')
    .pipe(postcss([
      autoprefixer,
      modules({ getJSON: getJSONFromCssModules }),
    ]))
    .pipe(gulp.dest('./build'));
});


gulp.task('html', ['css'], () => {
  return gulp.src('./html/index.ejs')
    .pipe(ejs({ className: getClass }, { ext: '.html' }))
    .pipe(gulp.dest('./build'));
});

```

### browserslist
```
defaults: Browserslist’s default browsers (> 0.5%, last 2 versions, Firefox ESR, not dead).
```
