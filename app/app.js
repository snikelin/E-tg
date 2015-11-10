'use strict';

define([
    'angular',
    'ui.router',
    'angular-animate',
    'angular-resource',
    'angular-cookies',
    'angular-sanitize',
    'ui.bootstrap',
    'templates',
    'components/home/home',
    'components/login/login'
],function(angular){
    return angular.module('etgApp',[
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ui.bootstrap',
        'etgApp.templates',
        'etgApp.home',
        'etgApp.login'
    ])
    .config(function($stateProvider, $urlRouterProvider){
        // $stateProvider
        //     .state('home',{
        //         url: "/home",
        //         templateUrl:"components/home/home.html"
        //     })
        //     .state("login",{
        //         url: "/login",
        //         templateUrl:"components/login/login.html"
        //     });
        $urlRouterProvider.otherwise("/home");
    })
    .run(function(){
    });
});
