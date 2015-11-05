'use strict';
define([
    'angular',
    'ui.router',
    'angular-md5',
],function(angular){
    angular.module('etgApp.login',['ui.router','angular-md5'])
    .config(function($stateProvider){
        $stateProvider
            .state('login',{
                url: "/login",
                templateUrl:"components/login/login.html"
            });
    })
    .controller('LoginCtrl',function($scope,md5){
        $scope.user = "";
        $scope.passwd = "";
        $scope.submit = function(){
            $scope.encrypted = md5.createHash($scope.passwd || '');
        };
    });
})
