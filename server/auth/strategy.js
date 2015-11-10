"use strict";

var util = require('util'),
    passport = require('passport-strategy'),
    account = require("./account");

function Strategy(options) {
  options = options || {};
  passport.Strategy.call(this);
  this.name = 'etg';
}

Strategy.loginType = {
  email: 0,
  IKey: 1
};



util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function(req, options) {

  var value = lookup(req.body) || lookup(req.query);

  var self = this;
  if(value.loginType === Strategy.loginType.email){
    account.findByEmail(value.email, value.password)
      .then(function(user){
        self.success(user);
      },function(){
        self.fail("not found");
      });
  } else {
    account.findSerial(value.serial)
      .then(function(user){
        self.success(user);
      },function(){
        self.fail("not found");
      });
  }

  function lookup(obj){
    if(obj.loginType === Strategy.loginType.IKey && obj.serial) {
      return {
        "serial":obj.serial,
        "loginType": Strategy.loginType.IKey
      };
    } else if(obj.loginType === Strategy.loginType.email && obj.email && obj.password) {
        return {
          "email": obj.email,
          "password": obj.password,
          "loginType": Strategy.loginType.email
        };
    }
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
