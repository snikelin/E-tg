define([
    'angular',
    'ui.router',
    './login-widget'
],function(angular){
    'use strict';
    return angular.module('etgApp.login',['ui.router','etgApp.login.widget'])
    .config(function($stateProvider){
        $stateProvider
            .state('login',{
                url: "/login",
                views: {
                    '': {
                        templateUrl:'components/login/main.html',
                        controller: 'LoginCtrl'
                    }
                }
            });
    })
    .controller('LoginCtrl',function($scope){

    })
    ;
});
