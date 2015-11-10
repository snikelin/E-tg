"use strict";

let chai = require('chai'),
    sinon = require('sinon'),
    should = chai.should();
chai.use(require('chai-passport-strategy'));
chai.use(require('sinon-chai'));

var account = require("../auth/account");
var EtgStrategy = require("../auth/strategy");
var Q = require("q");


describe("EtgStrategy",function(){
  var strategy = new EtgStrategy(function(loginInfo, done){
      if(loginInfo.email === "test@example.com"){
          done(null,{id:'123',name:"admin"});
      }
      else {
          done(null,false,'user not found');
      }
  });
  describe('handling a request with a valid credential in body',function(){
    var user,info;
    before(function(done){
      chai.passport.use(strategy)
        .success(function(u,i){
          user = u;
          info = i;
          done();
        })
        .req(function(req){
          req.body = {};
          req.body.email = "test@example.com";
          req.body.password = "6719003c3770069d88f9d3423fb1b067";
          req.body.loginType = EtgStrategy.loginType.email;
        })
        .authenticate();
    });
    it("should supply user",function(){
      user.should.to.be.an('object');
      user.id.should.equal('123');
      user.name.should.equal('admin');
    });
  });
  describe('handling a request with an invalid credential in body',function(){
      var error;
      before(function(done){
        chai.passport.use(strategy)
          .fail(function(err){
            error = err;
            done();
          })
          .req(function(req){
            req.body = {};
            req.body.email = "abc";
            req.body.password = "def";
            req.body.loginType = EtgStrategy.loginType.email;
          })
          .authenticate();
      });
      it("should provide fail information",function(){
          error.should.equal('user not found');
      });
  });
});
