"use strict";

module.exports = function(config){
  config.set({
    basePath: "./",
    files: [
      {pattern: 'app/bower_components/angular/angular.min.js', included: false},
      {pattern: 'app/bower_components/angular-animate/angular-animate.min.js', included: false},
      {pattern: 'app/bower_components/angular-resource/angular-resource.min.js', included: false},
      {pattern: 'app/bower_components/angular-cookies/angular-cookies.min.js', included: false},
      {pattern: 'app/bower_components/angular-sanitize/angular-sanitize.min.js', included: false},
      {pattern: 'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js', included: false},
      {pattern: 'app/bower_components/angular-md5/angular-md5.min.js', included: false},
      {pattern: 'app/bower_components/angular-ui-router/release/angular-ui-router.min.js', included: false},
      {pattern: 'app/bower_components/angular-mocks/angular-mocks.js', included: false},
      {pattern: 'app/bower_components/jquery/dist/jquery.min.js', included: false},
      {pattern: 'app/components/**/*.js', included: false},
      {pattern: 'app/templates.js', included: false},
      {pattern: 'app/app.js', included: false},
      //"**/*.html",

      // needs to be last
      'app/main.js'
    ],
    autoWatch: true,
    //singleRun: true,
    frameworks: ['mocha','requirejs','chai'],
    browsers: ['PhantomJS'],
    reporters: ['mocha','coverage'],//,'coveralls'
    preprocessors:{
        'app/components/**/*.js': ['coverage'],
    //    'app/components/**/*.html': ['ng-html2js']
    },
    coverageReporter:{
        dir: 'build/reports/coverage',
        reporters: [
            {type: 'html', subdir: 'report-html'},
            {type: 'text', subdir: '.', file: 'text.txt'},
            // {type: 'lcov', subdir: 'coveralls'}
        ]
    },
    // coverallsReporter: {
    //     repoToken: 'dVG6Zf9dBUDBWY462EUVBgzoHNLLyAKA9'
    // },
    // ngHtml2JsPreprocessor: {
    //     stripPrefix: 'app/',
    //     moduleName: 'etgApp.templates'
    // },
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-requirejs',
      'karma-mocha-reporter',
      'karma-coverage',
    //   'karma-coveralls'
      //'karma-ng-html2js-preprocessor'
    ]
  });
};
