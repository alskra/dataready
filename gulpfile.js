'use strict';

const gulp = require('gulp');
const rigger = require('gulp-rigger');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const urlAdjuster = require('gulp-css-url-adjuster');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const filter = require('gulp-filter');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const combiner = require('stream-combiner2').obj;
const pug = require('gulp-pug');
const path = require('path');
const rename = require("gulp-rename");
const map = require('map-stream');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const htmlparser = require("htmlparser2");
const posthtml = require('gulp-posthtml');
const autoprefixer = require('autoprefixer-stylus');
const emittyPug = require('emitty').setup('src/templates/', 'pug');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');
const cache  = require('gulp-memory-cache');
const zip = require('gulp-zip');

global.isDevelopment = process.env.NODE_ENV !== 'production';
global.depsObj = {};
global.depsArr = [];

const pkgData = './package.json';
const depsData = './deps.json';

// File where the favicon markups are stored
const faviconData = './src/favicon/faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'src/favicon/favicon.svg',
        dest: 'public/favicon/',
        iconsPath: 'favicon/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#295786',
                margin: '21%'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'whiteSilhouette',
                backgroundColor: '#295786',
                onConflict: 'override'
            },
            androidChrome: {
                pictureAspect: 'shadow',
                themeColor: '#295786',
                manifest: {
                    name: 'Magwai',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override'
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#12aaeb'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: faviconData
    }, function() {
        done();
    });
});

function getDepsObj(file) {
    Array.isArray(depsObj[file.stem]) ? depsObj[file.stem].splice(0, depsObj[file.stem].length) : depsObj[file.stem] = [];
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(attribs.class){
                attribs.class.split(' ').forEach(function(className) {
                    (depsObj[file.stem].indexOf(className) === -1) && (className.indexOf('__') === -1) && (className.indexOf('_') === -1) && depsObj[file.stem].push(className);
                });
            }
        }
    }, {decodeEntities: true});
    parser.write(file.contents.toString());
    parser.end();

    return file;
}

gulp.task('deps', function (done) {
    var arr = [];
    depsArr.splice(0, depsArr.length);
    for (var prop in depsObj) if (depsObj.hasOwnProperty(prop)){
        depsObj[prop].forEach(function (className) {
            (arr.indexOf(className) === -1) && (arr.push(className));
        });
    }
    JSON.parse(fs.readFileSync(depsData)).levels.forEach(function (level) {
        arr.forEach(function (className) {
            depsArr.push(path.join(level, className));
        });
    });
    //console.log(depsObj);
    //console.log(depsArr);
    done();
});

gulp.task('html', gulp.series(function() {
    return combiner(
        gulp.src(['src/templates/**/*.pug', '!src/templates/{helpers,components}/**/*.*']),
        gulpIf(global.isWatch, emittyPug.stream(global.emittyChangedFile)),
        pug({
            pretty: true,
            locals: {
                pkg: JSON.parse(fs.readFileSync(pkgData)),
                faviconCode: JSON.parse(fs.readFileSync(faviconData)).favicon.html_code
            }
        }),
        posthtml([
            require('posthtml-bem-sugar')({
                blockPrefix: '-',
                elemPrefix: '__',
                modPrefix: '_',
                modDlmtr: '_'
            }),
            require('posthtml-bem')()
        ]),
        map(function (file, cb) {cb(null, getDepsObj(file));}),
        debug({title: 'HTML'}),
        gulp.dest('public/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'HTML',
            message: err.message
        }
    }));
}, 'deps'));

gulp.task('css', function() {
    var deps = JSON.parse(fs.readFileSync(depsData));
    var depsCss = [];
    deps.css.forEach(function (dep) {
        Array.isArray(deps[dep].css) ? depsCss = depsCss.concat(deps[dep].css) : deps[dep].css && depsCss.push(deps[dep].css);
    });
    const fStyl = filter(function (file) {return file.extname == '.styl'}, {restore: true});
    return combiner(
        gulp.src(depsCss.concat(depsArr.map(function (dep) {return path.join(dep, '**/*.styl');}))),
        gulpIf(isDevelopment, sourcemaps.init()),
        fStyl,
        concat({path: 'main.styl'}),
        stylus({
            'include css': true,
            use: [autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            })]
        }),
        fStyl.restore,
        concat({path: 'main.css'}),
        gulpIf(!isDevelopment, cleanCSS()),
        gulpIf(isDevelopment, sourcemaps.write()),
        debug({title: 'CSS'}),
        gulp.dest('public/css/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'CSS',
            message: err.message
        }
    }));
});

gulp.task('js:components', function() {
    var deps = JSON.parse(fs.readFileSync(depsData));
    var depsJs = [];
    deps.js.forEach(function (dep) {
        Array.isArray(deps[dep].js) ? depsJs = depsJs.concat(deps[dep].js) : deps[dep].js && depsJs.push(deps[dep].js);
    });
    return combiner(
        gulp.src(depsJs),
        gulpIf(isDevelopment, sourcemaps.init()),
        concat({path: 'components.js'}),
        gulpIf(!isDevelopment, uglify()),
        gulpIf(isDevelopment, sourcemaps.write()),
        debug({title: 'JS:components'}),
        gulp.dest('public/js/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'JS:components',
            message: err.message
        }
    }));
});

gulp.task('js:main', function() {
    return combiner(
        gulp.src(depsArr.map(function (dep) {return path.join(dep, '**/*.js');})),
        gulpIf(isDevelopment, sourcemaps.init()),
        concat({path: 'main.js'}),
        gulpIf(isDevelopment, sourcemaps.write()),
        debug({title: 'JS:main'}),
        gulp.dest('public/js/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'JS:main',
            message: err.message
        }
    }));
});

gulp.task('js', gulp.series('js:components', 'js:main'));

gulp.task('img', function() {
    return combiner(
        gulp.src(depsArr.map(function (dep) {return path.join(dep, '**/*.{png,jp?g,gif,svg}');})),
        rename(function (path) {
            path.base = path.dirname
        }),
        newer('public/img'),
        imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()],
            interlaced: true
        }),
        debug({title: 'IMG'}),
        gulp.dest('public/img/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'IMG',
            message: err.message
        }
    }));
});

gulp.task('files', function() {
    return combiner(
        gulp.src(['src/files/**/*.*']),
        newer('public/files'),
        debug({title: 'FILES'}),
        gulp.dest('public/files/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'FILES',
            message: err.message
        }
    }));
});

gulp.task('fonts', function() {
    return combiner(
        gulp.src(['src/fonts/**/*.{woff2,woff,ttf,eot,svg}', '!src/fonts/glyphicons/**/*.*']),
        debug({title: 'FONTS'}),
        gulp.dest('public/fonts/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'FONTS',
            message: err.message
        }
    }));
});

gulp.task('fontawesome', gulp.parallel(
    function() {
        return combiner(
            gulp.src(['./node_modules/fa-stylus/fonts/**/*.*']),
            debug({title: 'FONTAWESOME'}),
            gulp.dest('public/fonts/font-awesome/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'FONTAWESOME',
                message: err.message
            }
        }));
    },
    function() {
        return combiner(
            gulp.src(['src/fonts/font-awesome/font-awesome.styl']),
            stylus({
                use: [require('fa-stylus')()]
            }),
            debug({title: 'FONTAWESOME'}),
            gulp.dest('src/fonts/font-awesome/')
        ).on('error', notify.onError(function(err) {
            return {
                title: 'FONTAWESOME',
                message: err.message
            }
        }));
    }
));

gulp.task('glyphicons', function(){
    return combiner(
        gulp.src(['src/fonts/glyphicons/icons/*.svg']),
        iconfontCss({
            fontName: 'glyphicons',
            targetPath: '../../../src/fonts/glyphicons/glyphicons.css',
            fontPath: '../fonts/glyphicons/',
            cssClass: 'icon',
            path: 'src/fonts/glyphicons/.css_tmp'
        }),
        iconfont({
            fontName: 'glyphicons',
            prependUnicode: true,
            formats: ['woff2', 'woff', 'ttf', 'eot', 'svg'],
            fontHeight: 600, //creating the icons larger allows for better rendering at sizes greater than 100px
            normalize: true
        }),
        debug({title: 'GLYPHICONS'}),
        gulp.dest('public/fonts/glyphicons/')
    ).on('error', notify.onError(function(err) {
        return {
            title: 'GLYPHICONS',
            message: err.message
        }
    }));
});

gulp.task('clean', function() {
    return del(['public/', 'dist/']);
});

gulp.task('build', gulp.series('clean', 'favicon',
gulp.parallel('html', 'fonts', 'fontawesome', 'glyphicons', 'files'), 'img', gulp.parallel('css', 'js')));

gulp.task('watch', function() {
    global.isWatch = true;

    gulp.watch('src/templates/**/*.pug', gulp.series('html', 'img', gulp.parallel('css', 'js:main')))
        .on('all', function(event, filepath) {
            global.emittyChangedFile = filepath;
            console.log('emittyChangedFile: ' + filepath);
        })
        .on('unlink', function (filepath) {
            delete depsObj[path.parse(filepath).name];
            return del('public/' + path.parse(filepath).name + '.html');
        });
    gulp.watch(['src/**/*.{css,styl}', 'app_components/**/*.{css,styl}'], gulp.series('css'));
    gulp.watch(['src/**/*.js', 'app_components/**/*.js'], gulp.series('js'));
    gulp.watch(JSON.parse(fs.readFileSync(depsData)).levels.map(function (dep) {return path.join(dep, '**/*.{png,jp?g,gif,svg}');}), gulp.series('img'));
    gulp.watch(['src/fonts/**/*.{woff2,woff,ttf,eot,svg}', '!src/fonts/glyphicons/**/*.*'], gulp.series('fonts'));
    gulp.watch('src/fonts/glyphicons/icons/*.svg', gulp.series('glyphicons'));
    gulp.watch('src/files/**/*.*', gulp.series('files'));
    gulp.watch([pkgData, depsData], gulp.series('html', 'img', gulp.parallel('css', 'js')));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'public/'
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: 'AlSKra'
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('zip', function () {
    var pkg = JSON.parse(fs.readFileSync(pkgData));
    return gulp.src('public/**/*.*')
        .pipe(zip(pkg.name.toLowerCase() + '-' + pkg.version + '.zip'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);

gulp.task('prod', gulp.series(
    function (done) {
        global.isDevelopment = false;
        done();
    },
    gulp.series('build', gulp.parallel('watch', 'serve', 'zip'))
));

