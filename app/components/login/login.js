/*
    Author: Beeven Yip
    Created on: 11/10/2015
*/

define([
    'angular',
    'ui.router',
    'angular-md5',
    './auth',
    'templates'
],function(angular){
    'use strict';
    angular.module('etgApp.login',['ui.router','etgApp.auth', 'etgApp.templates'])
    .config(function($stateProvider){
        $stateProvider
            .state('login',{
                url: "/login"
            });
    })
    .controller('LoginCtrl',function($scope,authentication, authConstants){
        $scope.loginWithEmail = function(){
            return authentication.login({
                email: $scope.email,
                password: $scope.password,
                loginType: authConstants.enums.loginType.email
            }).then(function(user){

            },function(err){

            });
        };
        $scope.loginWithIKey = function(){
            return authentication.login({
                serial : $scope.serial,
                loginType: authConstants.enums.loginType.IKey
            }).then(function(user){

            },function(err){

            });
        };
    })
    .directive('etgLogin',function(){
        return {
            restrict: 'E',
            templateUrl: 'components/login/login.html',
            scope: {
                'onLogin':'=?'
            },
            controller: 'LoginCtrl'
        };
    });
});
