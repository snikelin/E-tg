"use strict";

let chai = require('chai'),
    should = chai.should();
chai.use(require('chai-passport-strategy'));

var auth = require("../auth");
var EtgStrategy = require("../auth/strategy");

describe("Auth",function(){
    it("is meerly a test",function(done){
        auth.should.a('function');
        done();
    });
    describe("EtgStrategy",function(){
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
});
