'use strict';

if(window.__karma__) {
	var allTestFiles = [];
	var TEST_REGEXP = /spec\.js$/;

	var pathToModule = function(path) {
		return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
	};

	Object.keys(window.__karma__.files).forEach(function(file) {
		if (TEST_REGEXP.test(file)) {
			// Normalize paths to RequireJS module names.
			allTestFiles.push(pathToModule(file));
		}
	});
}

require.config({
  paths: {
      "angular": 'bower_components/angular/angular.min',
      "ui.router": 'bower_components/angular-ui-router/release/angular-ui-router.min',
      "angular-mocks": 'bower_components/angular-mocks/angular-mocks',
      "angular-animate": 'bower_components/angular-animate/angular-animate.min',
      "angular-resource": 'bower_components/angular-resource/angular-resource.min',
      "angular-cookies": 'bower_components/angular-cookies/angular-cookies.min',
      "angular-sanitize": 'bower_components/angular-sanitize/angular-sanitize.min',
      "angular-touch": 'bower_components/angular-touch/angular-touch.min',
      "jquery": "bower_components/jquery/dist/jquery.min",
      "ui.bootstrap":"bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
      "angular-md5":"bower_components/angular-md5/angular-md5.min"
  },
  shim: {
      'jquery': { 'exports': '$'},
      'angular': {
          deps: ['jquery'],
          'exports' : 'angular'
      },
      'angular-mocks': {
         deps: ['angular'],
         'exports':'mocks'
      },
      'ui.router': ['angular'],
      'angular-animate': {
          deps: ['angular'],
          'exports':'ngAnimate'
      },
      'angular-resource': {
          deps: ['angular'],
          'exports': 'ngResource'
      },
      'angular-cookies':{
          deps:['angular'],
          'exports': 'ngCookies'
      },
      'angular-sanitize':{
          deps:['angular'],
          'exports':'ngSanitize'
      },
      'angular-md5': {
          deps: ['angular'],
          'exports': 'md5'
      },
      'angular-touch':{
          deps:['angular'],
          'exports': 'ngTouch'
      },
      'ui.bootstrap': {
          deps: ['angular']
      }
  },
  priority: [
      "angular"
  ],
  deps: window.__karma__ ? allTestFiles: [],
  callback: window.__karma__ ? window.__karma__.start : null,
  baseUrl: window.__karma__ ? '/base/app' : '',
});

require(['angular','app'],function(angular,app){
    angular.element(document).ready(function(){
        angular.bootstrap(document,['etgApp']);
    });
})
