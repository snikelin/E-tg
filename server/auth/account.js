"use strict";

var Q = require("q");

class Account {
  constructor(){}
  static findByEmail(email,password){
    return Q.promise(function(resolve,reject,notify){
      setTimeout(function(){
        resolve({
            id: "123",
            name: "admin",
            permissions: ['administrator']
        });
      });
    });
  }
  static findBySerial(serial){
    return Q.promise(function(resolve,reject,notify){
      setTimeout(function(){
        resolve({
            id: "123",
            name: "admin",
            permissions: ['administrator']
        });
      });
    });
  }
}

module.exports = Account;
