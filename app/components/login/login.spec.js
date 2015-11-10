'use strict';
define(['app','angular-mocks','templates'],function(app){
    describe('Login component',function(){

        beforeEach(module('etgApp.templates'));
        beforeEach(module('etgApp.login'));
        var $controller;
        var authentication, authConstants,$httpBackend,$rootScope;
        beforeEach(inject(function($injector,_$controller_,_authentication_,_authConstants_){
            $controller = _$controller_;
            authentication = _authentication_;
            authConstants = _authConstants_;
            $rootScope = $injector.get("$rootScope");
            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.whenPOST(authConstants.serviceUrl+"/login")
                        .respond({
                            status:"success",
                            user: {
                                name:"admin",
                                permissions: ['administrator']
                            }
                        });
        }));
        describe('Login Ctrl',function(){
            it('should fire loggedIn event',function(done){
                var $scope = {};
                var controller = $controller('LoginCtrl',{$scope:$scope});
                $scope.password = "longenoughpassword";
                $rootScope.$on(authConstants.events.loggedIn,function(event){
                    var user = authentication.getCurrentUser();
                    user.should.be.an("object");
                    user.name.should.equal("admin");
                    done();
                });
                $scope.loginWithEmail();
                $httpBackend.flush();
            });
        });

        describe('etgLogin directive',function(){
            var $compile;
            beforeEach(inject(function(_$compile_){
                $compile = _$compile_;
            }));
            it('should fill the element with the appropriate content',function(){
                // Compile a piece of HTML containing the directive
                var element = $compile("<etg-login></etg-login>")($rootScope);
                 // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
                $rootScope.$digest();
                // Check that the compiled element contains the templated content
                angular.element(element.children()[0]).hasClass('login-widget').should.be.true;
            });
        });
    });
});
