/*
    Author: Beeven Yip
    Created on: 11/10/2015
*/

define([
    'angular',
    'angular-md5',
    'components/auth/auth'
],function(angular){
    'use strict';
    return angular.module('etgApp.login.widget',['etgApp.auth'])
    .controller('LoginWidgetCtrl',function($scope,authentication, authConstants){
        $scope.user = $scope.user || {};
        function isNullOrUndefinedOrEmpty(str){
            return typeof(str) === 'undefined' || str === null || str === "";
        }
        $scope.loginWithEmail = function(){
            if(isNullOrUndefinedOrEmpty($scope.user.email) || isNullOrUndefinedOrEmpty($scope.user.password)) {
                return;
            }
            return authentication.login({
                email: $scope.user.email,
                password: $scope.user.password,
                loginType: authConstants.enums.loginType.email
            }).then(function(user){
                if(typeof($scope.onLogin)==='undefined' || $scope.onLogin === null){
                    return;
                }
                $scope.onLogin(user);
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
            templateUrl: 'components/login/login-widget.html',
            scope: {
                'onLogin':'=?'
            },
            controller: 'LoginWidgetCtrl'
        };
    });
});
