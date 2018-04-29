// Karma configuration
// Generated on Mon Jul 04 2016 16:17:49 GMT+0300 (IDT)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            { pattern: 'spec.bundle.js', watched: false }
            // { pattern: 'content-body.spec.js' }
        ],


        // list of files to exclude
        exclude: [],

        plugins: [
            require('karma-chai'),
            require('karma-chrome-launcher'),
            require('karma-mocha'),
            require('karma-mocha-reporter'),
            require("karma-sourcemap-loader"),
            require("karma-webpack")
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'spec.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: 'ng-annotate!babel?presets[]=es2015'},
                    { test: /\.less$/, loader: 'style!css!less?root=.'},
                    { test: /\.css$/, loader: 'style!css?root=.'},
                    { test: /\.json$/, loader: "json" },
                    { test: /\.(ttf|eot|svg|otf)$/, loader: "file" },
                    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
                    { test: /\.html$/, exclude: /node_modules/, loader: "raw" }
                ]
            }
        },

        webpackServer: {
            noInfo: true // prevent console spamming when running in Karma!
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],


        // web server port
        port: 3001,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        browserNoActivityTimeout: 100000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
