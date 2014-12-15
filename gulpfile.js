/* jshint node:true */
'use strict';
// generated on 2014-12-13 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var to5 = require('gulp-6to5');
var browserify = require('browserify');
var to5ify = require("6to5ify");
var fs = require('fs')
gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.plumber())
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer({
            browsers: ['last 1 version']
        }))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function() {
    var lazypipe = require('lazypipe');
    var cssChannel = lazypipe()
        .pipe($.csso)
        .pipe($.replace, 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts');
    var assets = $.useref.assets({
        searchPath: '{.tmp,app}'
    });

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', cssChannel()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({
            conditionals: true,
            loose: true
        })))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
    return gulp.src([
        'app/*.*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function() {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({
            port: 35729
        }))
        .use(serveStatic('.tmp'))
        .use(serveStatic('app'))
        // paths to bower_components should be relative to the current file
        // e.g. in app/index.html you should use ../bower_components
        .use('/bower_components', serveStatic('bower_components'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'watch'], function() {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});



gulp.task('scripts', function() {

    // var target = gulp.src('./app/index.html');
    // var transform = require('vinyl-transform')
    // var browserified = transform(function(filename) {
    //     return

    //     gulp.src('app/scripts/main.js')
    //         .pipe(browserified)
    //         .pipe(gulp.dest('.tmp/scripts'))


    return browserify({
            debug: true
        })
        .transform(to5ify.configure({
            sourceMap: 'inline'
        }))
        .require("./app/scripts/main.js", {
            entry: true
        })
        .bundle()
        .pipe(fs.createWriteStream(".tmp/scripts/bundle.js"))

})


gulp.task('inject', ['scripts'], function() {

    var target = gulp.src('./app/index.html');
    var sources = gulp.src('.tmp/**/*.js');

    return target.pipe($.inject(sources, {
            ignorePath: '/.tmp'
        }))
        .pipe(gulp.dest('./app'))
})



gulp.task('watch', ['connect', 'scripts', 'inject'], function() {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', $.livereload.changed);


    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts', 'inject']);

    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras', 'scripts'], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});

gulp.task('test', function() {
    var trans = require('vinyl-transform')
    var browserified = trans(function(filename) {
        var b = browserify(filename)
            .transform(to5ify);
        return b.bundle();
    });

    return gulp.src('test/spec/**/*.js')
        .pipe(browserified)
        .pipe(gulp.dest('test/compiled/bundle.js'))
        .pipe($.tape())
});





gulp.task('default', ['clean'], function() {
    gulp.start('build');
});
