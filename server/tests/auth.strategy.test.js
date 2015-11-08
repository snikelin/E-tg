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
  var strategy = new EtgStrategy();
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
    });
  });
});
