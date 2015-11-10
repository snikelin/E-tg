"use strict";

let chai = require('chai'),
    sinon = require('sinon'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(require('chai-passport-strategy'));
chai.use(require('sinon-chai'));
chai.use(chaiHttp);

var account = require("../auth/account");
var auth = require("../auth");
var Q = require("q");
var express = require("express"),
    session = require("express-session"),
    bodyParser = require("body-parser");

describe("Auth", function() {
    var app;
    beforeEach(function() {
        function fakeUserPromise() {
            return Q.promise(function(resolve, reject, notify) {
                setTimeout(function() {
                    resolve({
                        id: "123",
                        name: "admin",
                        permissions: ['administrator']
                    });
                });
            });
        }
        sinon.stub(account, 'findByEmail', function(email, password) {
            return fakeUserPromise();
        });
        sinon.stub(account, 'findBySerial', function(serial) {
            return fakeUserPromise();
        });
        app = express();
        app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: 'e-tg'
        }));
        app.use(bodyParser.json());
    });
    afterEach(function() {
        account.findByEmail.restore();
        account.findBySerial.restore();
    });
    it("is a middleware", function() {
        auth.should.be.a('function');
    });
    // it("provides 2 routes for login and logout", function() {
    //     app.use(auth());
    //     chai.request(app)
    //         .post("/auth/login")
    //         .send({
    //             email: "test@example.com",
    //             password: "6719003c3770069d88f9d3423fb1b067",
    //             loginType: 0
    //         })
    //         .then(function(res){
    //             expect(res).to.have.status(200);
    //             expect(res.body.user).to.be.an('object');
    //             expect(1).to.equal(2);
    //         })
    //         .catch(function(err){
    //             throw err;
    //         });
    // })

});
