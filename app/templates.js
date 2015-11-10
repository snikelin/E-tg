define(['angular'],function(angular){'use strict';
 return angular.module('etgApp.templates',[]).run(['$templateCache', function($templateCache) {
$templateCache.put('components/home/home.html',
    '<div class="home-page">\n' +
    '  Home\n' +
    '</div>\n' +
    '');

$templateCache.put('components/login/login.html',
    '<div class="login-widget">\n' +
    '  <uib-tabset justified="true">\n' +
    '      <uib-tab heading="邮箱登录">\n' +
    '          <form>\n' +
    '              <div class="input-group">\n' +
    '                  <span class="input-group-addon">\n' +
    '                      <i class="glyphicon glyicon-user"></i>\n' +
    '                  </span>\n' +
    '                  <input type="text" class="form-control" placeholder="邮箱" ng-model="email">\n' +
    '              </div>\n' +
    '              <div class="input-group">\n' +
    '                  <div class="input-group-addon">\n' +
    '                      <i class="glyphicon glyphicon-lock"></i>\n' +
    '                  </div>\n' +
    '                  <input type="text" class="form-control" placeholder="密码" ng-model="password">\n' +
    '              </div>\n' +
    '              <div class="row">\n' +
    '                  <a href="">忘记密码?</a>\n' +
    '              </div>\n' +
    '              <button class="btn btn-primary btn-block" ng-click="loginWithEmail()">登&nbsp;录</button>\n' +
    '          </form>\n' +
    '      </uib-tab>\n' +
    '      <uib-tab heading="IKey登录">\n' +
    '          <div class="row">\n' +
    '              <p>请插入IKey并点击登录</p>\n' +
    '              <button class="btn btn-primary btn-block" ng-click="loginWithIKey()">登&nbsp;录</button>\n' +
    '          </div>\n' +
    '      </uib-tab>\n' +
    '  </uib-tabset>\n' +
    '</div>\n' +
    '');

$templateCache.put('components/register/register.html',
    '<div class="register-page">\n' +
    '  Register\n' +
    '</div>\n' +
    '');
	}]);
});