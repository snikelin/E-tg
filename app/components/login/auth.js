/*
    Author: Beeven Yip
    Created on: 11/10/2015
*/

define(['angular','ui.router','angular-md5','angular-cookies'],function(angular){
    'use strict';
    angular.module('etgApp.auth',['ui.router','angular-md5','ngCookies'])
        .constant('authConstants',{
            enums: {
                permissionCheckType:{
                    atLeastOne: 0,
                    combinationRequired: 1
                },
                authorizeResult: {
                    authorized: 0,    // user can proceed;
                    loginRequired: 1, // redirect user to login
                    notAuthorized: 2  // rejected
                },
                loginType: {
                    email: 0,
                    IKey: 1
                }
            },
            events: {
                shouldLogin: 'auth:shouldLogin',
                notAuthorized: 'auth:notAuthorized',
                loggedIn: 'auth:loggedIn',
                loggedOut: 'auth:loggedOut'
            },
            serviceUrl: '/auth',
            interceptHttpRequests: true
        })
        .factory('authentication',
            function AuthenticationFactory(authConstants, md5, $http, $q, $cookies, $rootScope){
            var authServiceUrl = authConstants.serviceUrl;
            var authServiceLoginUrl = authServiceUrl + "/login";
            var authServiceLogoutUrl = authServiceUrl + "/logout";

            var currentUser;
            var createUser = function(name, permissions){
                return {
                    name: name,
                    permissions: permissions
                };
            };
            var login = function(loginInfo){
                var deferred = $q.defer();
                loginInfo.loginType = loginInfo.loginType || authConstants.enums.loginType.email;
                var postData = {};
                if(loginInfo.loginType == authConstants.enums.loginType.email) {
                    postData.email = loginInfo.email;
                    postData.password = md5.createHash(loginInfo.password);
                    postData.loginType = loginInfo.loginType;
                } else {
                    postData.serial = loginInfo.serial;
                    postData.loginType = loginInfo.loginType;
                }
                $http.post(authServiceLoginUrl,
                    postData,
                    {
                        xsrfHeaderName: "XSRF-T0KEN",
                        xsrfCookieName: "X-XSRF-T0KEN"
                    }
                ).then(function(response){
                    /*
                       response =
                        {
                            status: "success" | "fail",
                            user: {name, permissions}
                        }
                        server will set cookies "userToken"
                    }*/

                    if(response.data.status == "success"){
                        currentUser = createUser(response.data.user.name, response.data.user.permissions);
                        deferred.resolve();
                        $rootScope.$broadcast(authConstants.events.loggedIn);
                    } else {
                        deferred.reject();
                    }
                },function(response){
                    deferred.reject(response.statusText);
                });
                return deferred.promise;
            };
            var logout = function(){
                var deferred = $q.defer();
                $http.post(authServiceLogoutUrl)
                        .then(function(response){
                            currentUser = undefined;
                            $cookies.remove("userToken");
                            deferred.resolve();
                            $rootScope.$broadcast(authConstants.events.loggedOut);
                        },function(response){
                            deferred.reject();
                        });
                return deferred.promise;
            };
            var getCurrentUser = function(){
                if(typeof(currentUser) === 'undefined' || currentUser === null){
                    return $cookies.getObject("userToken");
                } else {
                    return currentUser;
                }
            };
            return {
                login: login,
                logout: logout,
                getCurrentUser: getCurrentUser
            };
        })
        .factory('authorization',function AuthorizationFactory(authentication,authConstants){
            var authorize = function(loginRequired, requiredPermissions, permissionCheckType){
                var user = authentication.getCurrentUser();
                var i;
                permissionCheckType = permissionCheckType || authConstants.enums.permissionCheckType.atLeastOne;
                if(loginRequired === true && user === undefined){
                    return authConstants.enums.authorizeResult.loginRequired;
                } else if( (loginRequired === true && user !== undefined) &&
                           (requiredPermissions === undefined || requiredPermissions.length === 0)){
                    // login is required but no specific permissions are specified.
                    return authConstants.enums.authorizeResult.authorized;
                } else if (requiredPermissions && user !== undefined) {
                    if(permissionCheckType == authConstants.enums.permissionCheckType.atLeastOne){
                        for(i = 0; i < requiredPermissions.length; i++){
                            if(user.permissions.indexOf(requiredPermissions[i]) > -1){
                                return authConstants.enums.authorizeResult.authorized;
                            }
                        }
                        return authConstants.enums.authorizeResult.notAuthorized;
                    } else if (permissionCheckType == authConstants.enums.permissionCheckType.combinationRequired) {
                        for(i = 0; i< requiredPermissions.length; i++){
                            if(user.permissions.indexOf(requiredPermissions[i]) == -1) {
                                return authConstants.enums.authorizeResult.notAuthorized;
                            }
                        }
                        return authConstants.enums.authorizeResult.authorized;
                    }
                } else if (loginRequired !== true) {
                    return authConstants.enums.authorizeResult.authorized;
                }
            };

            return {
                authorize: authorize
            };
        })
        .config(function(authConstants, $httpProvider){
            //console.log(auth);
        })
        .run(function($rootScope, authorization, authConstants){
            $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if(!toState.data){return;}
                if(typeof(toState.data.access) === 'undefined' || toState.data.access === null) {
                    return;
                }
                var authorizeResult = authorization.authorize(toState.data.access.loginRequired,
                        toState.data.access.permissions,
                        toState.data.access.permissionCheckType);
                if(authorizeResult == authConstants.enums.authorizeResult.loginRequired){
                    //$state.go(authConstants.states.login,{redirectTo:toState},{notify:false});
                    event.preventDefault();
                    $rootScope.$broadcast(authConstants.events.shouldLogin,{toState: toState});
                } else if (authorizeResult == authConstants.enums.authorizeResult.notAuthorized){
                    event.preventDefault();
                    $rootScope.$broadcast(authConstants.events.notAuthorized,{toState: toState});
                }
            });
        });
});
