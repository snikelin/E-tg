"use strict";

let chai = require('chai');
    should = chai.should();

var auth = require("../auth");

describe("Auth",function(){
    it("is meerly a test",function(done){
        auth.should.a('function');
        done();
    });
})
