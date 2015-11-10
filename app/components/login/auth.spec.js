

define(['app','angular-mocks','./auth'],function(app){
    'use strict';
    describe('auth module',function(){

        beforeEach(module('etgApp.auth',function($stateProvider, authConstants){
            $stateProvider
                .state('noAuthRequired',{})
                .state('authRequired',{
                    data:{
                        access: {
                            loginRequired: true
                        }
                    }
                })
                .state('authRequired.atLeastOne',{
                    data:{
                        access: {
                            loginRequired: true,
                            permissions: ['administrator','user']
                        }
                    }
                })
                .state('authRequired.combinationRequired',{
                    data:{
                        access: {
                            loginRequired: true,
                            permissions: ['administrator','user'],
                            permissionCheckType: authConstants.enums.permissionCheckType.combinationRequired
                        }
                    }
                });
        }));

        it('should contain constants and services',
            inject(function(authConstants, authentication, authorization){
                authConstants.should.not.be.an('undefined');
                authentication.should.not.be.an('undefined');
                authorization.should.not.be.an('undefined');
        }));

        describe('authentication service',function(){
            var authentication, authConstants,$httpBackend;
            beforeEach(inject(function($injector,_authentication_,_authConstants_){
                authentication = _authentication_;
                authConstants = _authConstants_;
                $httpBackend = $injector.get('$httpBackend');

            }));
            afterEach(function(){
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });
            it('should have a method named getCurrentUser',function(){
                authentication.should.respondTo('getCurrentUser');
            });
            it('should return undefined before login',function(){
                var user = authentication.getCurrentUser();
                expect(user).to.be.an('undefined');
            });
            it('should login a user if function login called',function(done){
                $httpBackend.expectPOST(authConstants.serviceUrl+"/login",
                        {
                            email:"test@example.com",
                            password:"6719003c3770069d88f9d3423fb1b067",
                            loginType: authConstants.enums.loginType.email
                        })
                    .respond({
                        status:"success",
                        user: {name:"admin", permissions:["administrator",]}
                    });
                authentication.login({
                    email:"test@example.com",
                    password:"longenoughpassword",
                    loginType:authConstants.enums.loginType.email
                })
                    .then(function(){
                        var user = authentication.getCurrentUser();
                        expect(user).to.be.an('object');
                        user.name.should.eql('admin');
                        done();
                    });
                $httpBackend.flush();
            });
            it('should not login if server respond failed',function(done){
                $httpBackend.expectPOST(authConstants.serviceUrl+"/login")
                    .respond({status:"fail"});
                    authentication.login("test@example.com","longenoughpassword")
                        .then(function(){
                            expect(true).to.eql(false);
                            done();
                        },function(){
                            var user = authentication.getCurrentUser();
                            expect(user).to.be.an('undefined');
                            done();
                        });
                $httpBackend.flush();
            });
            it('should delete current user after loggout',function(done){
                $httpBackend.expectPOST(authConstants.serviceUrl+"/logout")
                    .respond({});
                authentication.logout().then(function(){
                    expect(authentication.getCurrentUser()).to.be.an('undefined');
                    done();
                });
                $httpBackend.flush();
            });
        });
        describe('authorization service',function(){
            var authConstants,authRequestHandler, authorization, authentication,$httpBackend, $rootScope;
            beforeEach(inject(function($injector,_authorization_,_authConstants_,_authentication_){
                authConstants = _authConstants_;
                authorization = _authorization_;
                authentication = _authentication_;
                $httpBackend = $injector.get('$httpBackend');
                authRequestHandler = $httpBackend.when('POST', authConstants.serviceUrl+"/login")
                                         .respond({
                                             status: "success",
                                             user: {name:"admin", permissions:["administrator"]}
                                         });
            }));
            afterEach(function(){
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should has a method named authorize',function(){
                authorization.should.respondTo('authorize');
            });
            it('should pass if no login required',function(){
                authorization.authorize(false,[],authConstants.enums.permissionCheckType.atLeastOne)
                    .should.eql(authConstants.enums.authorizeResult.authorized);
            });
            it('should require login if user not yet login',function(done){
                authorization.authorize(true,['administrator'],authConstants.enums.permissionCheckType.atLeastOne)
                    .should.eql(authConstants.enums.authorizeResult.loginRequired);

                authentication.login("test@example.com","longenoughpassword").then(function(){
                    authorization.authorize(true,[],authConstants.enums.permissionCheckType.atLeastOne)
                        .should.eql(authConstants.enums.authorizeResult.authorized);
                    done();
                });
                $httpBackend.flush();
            });
            it('should require user to have at least a permission',function(done){
                authentication.login("test@example.com","longenoughpassword").then(function(){
                    authorization.authorize(true,['administrator','user'],authConstants.enums.permissionCheckType.atLeastOne)
                        .should.eql(authConstants.enums.authorizeResult.authorized);
                    done();
                });
                $httpBackend.flush();
            });
            it('should fail if user do not have the required permissions', function(done){
                authentication.login("test@example.com","longenoughpassword").then(function(){
                    authorization.authorize(true,['administrator','user'],authConstants.enums.permissionCheckType.combinationRequired)
                        .should.eql(authConstants.enums.authorizeResult.notAuthorized);
                    done();
                });
                $httpBackend.flush();
            });
        });

        describe('rootScope event',function(){
            var $httpBackend, authConstants,$rootScope,$state, authentication;
            beforeEach(inject(function($injector,_authConstants_,_authentication_){
                authConstants = _authConstants_;
                authentication = _authentication_;
                $httpBackend = $injector.get("$httpBackend");
                $httpBackend.when('POST', authConstants.serviceUrl+"/login")
                         .respond({
                             status: "success",
                             user: {name:"admin", permissions:["administrator"]}
                         });
                $httpBackend.when('POST', authConstants.serviceUrl+"/logout")
                        .respond(200);
                $rootScope = $injector.get("$rootScope");
                $state = $injector.get("$state");
            }));
            afterEach(function(){
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });
            it("should fire event if user hasn't logged in and is going to visit a loginRequired state",function(done){
                //console.log($state);
                $rootScope.$on(authConstants.events.shouldLogin,function(event,args){
                    args.toState.name.should.eql('authRequired');
                    expect($state.name).to.be.an('undefined');
                    done();
                });
                $state.go("authRequired");
            });
            it("should fire event after user logged in",function(done){
                $rootScope.$on(authConstants.events.loggedIn,function(event,args){
                    done();
                });
                authentication.login("test@example.com","longenoughpassword");
                $httpBackend.flush();
            });

            it("should fire event if user has logged in and is visiting a state without permission",function(done){
                $rootScope.$on(authConstants.events.notAuthorized,function(event,args){
                    args.toState.name.should.eql('authRequired.combinationRequired');
                    expect($state.name).to.be.an('undefined');
                    done();
                });
                authentication.login("test@example.com","longenoughpassword").then(function(){
                    $state.go("authRequired.combinationRequired");
                });
                $httpBackend.flush();
            });

            it("should fire event after user logged out",function(done){
                $rootScope.$on(authConstants.events.loggedOut,function(event,args){
                    done();
                });
                authentication.logout();
                $httpBackend.flush();
            });

        });
    });
});
