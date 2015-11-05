'use strict';

define([
    'angular',
    'ui.router'
],function(angular){
    return angular.module('etgApp.home',['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('home',{
                url: "/home",
                templateUrl:"components/home/home.html"
            });
    })
    .controller('HomeCtrl',function(){
    })
});
