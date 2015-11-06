'use strict';
define(['app','angular-mocks'],function(app){
    describe('LoginCtrl',function(){
        beforeEach(module('etgApp.login'));
        var $controller;
        beforeEach(inject(function(_$controller_){
            $controller = _$controller_;
        }));
        describe('$scope.submit',function(){
            it('sets the encrypted to the md5 hash of the password',function(){
                var $scope = {};
                var controller = $controller('LoginCtrl',{$scope:$scope});
                $scope.passwd = "longenoughpassword";
                $scope.submit();
                $scope.encrypted.should.equal("6719003c3770069d88f9d3423fb1b067");
            });
        });
    });
});
