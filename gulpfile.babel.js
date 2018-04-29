'use strict';

// gulp utilities
var gulp = require('gulp');
var install = require('gulp-install');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var bump = require('gulp-bump');

// node utilities
var path  = require('path');
var del = require('del');
var fs = require('fs');

// webpack utilities
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

// karma
var karma = require('karma');
var karmaServer = karma.server;

// define the label we want to take its assets and pages
var label = require('./label.json');

// dev root foldernp
let root = path.join(__dirname, 'src');

// paths
let paths = {
    dest: path.join(__dirname, 'dist'),
    pages: 'brands/'+ label.label +'/pages/**/*',
    assets: 'brands/'+ label.label +'/assets/**/*',
    less: 'brands/'+ label.label +'/less/**/*.less',
    components: 'brands/'+ label.label +'/less/components/**/*.less',
    lessOutput: 'brands/'+ label.label +'/less/',
    platform: 'plaform.php'

};

// ports
let ports = {
    dev: 8080
};

gulp.task('default', () => {
    // default
});

gulp.task("bundle", ["concat:css", "copy", "webpack:bundle"]);

gulp.task("serve", ["copy", "watch", "webpack:serve"]);

gulp.task("webpack:bundle", (callback) => {
    let webpackDistConfig = require('./webpack.dist.config.js');
    // run webpack
    webpack(webpackDistConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack bundle]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("webpack:serve", (callback) => {
    let webpackDevConfig = require('./webpack.dev.config');
    let compiler = webpack(webpackDevConfig);

    new WebpackDevServer(compiler, {
        contentBase: root,
        quiet: false,
        noInfo: false,
        lazy: false,
        hot: false,
        watchDelay: 300,
        stats: {
            colors: true
        }
    }).listen(ports.dev, 'localhost', (err) => {

        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }

        gutil.log('[webpack-dev-server]', 'http://localhost:' + ports.dev);
    });
    callback();
});

gulp.task("copy", ["copy:pages", "copy:assets", "copy:less"]);

/**
 * Copy the pages in the label's folder to src for development and to dist for production
 */
gulp.task("copy:pages", (callback) => {
    gulp.src([paths.pages]).pipe(gulp.dest('dist/pages'));
    gulp.src([paths.pages]).pipe(gulp.dest('src/app/components/page/jsons'));
    callback();
});

/**
 * Copy the less in the label's folder to src for development and to dist for production
 */
gulp.task("copy:assets", (callback) => {
    gulp.src([paths.assets]).pipe(gulp.dest('dist/assets'));
    gulp.src([paths.assets]).pipe(gulp.dest('src/assets'));
    callback();

});

/**
 * Copy the assets in the label's folder to src for development and to dist for production
 */
gulp.task("copy:less", (callback) => {
    gulp.src([paths.less]).pipe(gulp.dest('dist/assets/less'));
    gulp.src([paths.less]).pipe(gulp.dest('src/assets/less'));
    callback();

});

/**
 * Clean the generated code from previous bundles
 */
gulp.task('clean', (callback) => {
    del(['dist/**/*', '!dist', '!dist/platform.php','!dist/myAccountPlatform.php', '!dist/robots.txt', '!dist/.htaccess', '!dist/economic-calendar.css'], callback()).then((paths) => {
        gutil.log("[clean]", paths);

    });
});

/**
 * Concat all the less files in the assets/less/components folder to one file that will be imported to label.less
 */
gulp.task('concat:css', (callback) => {
    gulp.src([paths.components]).pipe(concat('components.less')).pipe(gulp.dest(paths.lessOutput));
    callback();
});

/**
 * Watch for changes in the brands folder and copy it to src folder
 */
gulp.task('watch', (callback) => {
    gulp.watch(paths.less, ['concat:css', 'copy:less'], callback);
    gulp.watch([paths.assets], ['copy:assets'], callback);
    gulp.watch([paths.pages], ['copy:pages'], callback);
});

/**
 * Configure the eslint task
 */
gulp.task('lint', () => {
    return gulp.src([`${root}/**/*.js`, `!${root}/assets/**/*`])
        .pipe(eslint({
            extends: 'eslint:recommended',
            parserOptions: {
                ecmaFeatures: {
                    "jsx": true,
                    "modules": true
                }
            },
            globals: {
                'jQuery':false,
                '$':true,
                'angular': true,
                '_': true,
                'require': true
            },
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Install all node modules before running the app
 */
gulp.task('install', (callback) => {
    gulp.src('./package.json')
        .pipe(install());
    callback();
});


// gulp test:unit, runs unit test suite
gulp.task('test:unit', function () {
    karmaServer.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

// // gulp test, runs full test suite
// gulp.task('test', ['test:unit']);

// gulp task to create new version
gulp.task('bump', function(callback){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
  callback();
});

// gulp task bundle version
gulp.task("webpack:version", (callback) => {
    let packageConfig = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    let webpackDistConfig = require('./webpack.dist.config.js');
    webpackDistConfig.output = {
        filename: 'bundle.js',
        path: path.resolve(__dirname, packageConfig.version)
    };
    // run webpack
    webpack(webpackDistConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack bundle]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("version", ['bump', 'webpack:version']);
