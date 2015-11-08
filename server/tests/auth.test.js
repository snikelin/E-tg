"use strict";

let chai = require('chai'),
    sinon = require('sinon'),
    should = chai.should();
chai.use(require('chai-passport-strategy'));
chai.use(require('sinon-chai'));

var account = require("../auth/account");
var auth = require("../auth");
var EtgStrategy = require("../auth/strategy");
var Q = require("q");

describe("Auth",function(){
  beforeEach(function(){
    function fakeUserPromise(){
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
    sinon.stub(account,'findByEmail',function(email,password){
      return fakeUserPromise();
    });
    sinon.stub(account,'findBySerial',function(serial){
      return fakeUserPromise();
    });
  });
  afterEach(function(){
    account.findByEmail.restore();
    account.findBySerial.restore();
  });

});
