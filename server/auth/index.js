/*
    Author: Beeven Yip
    Modified: Nov 5, 2015

    auth module: If the user is no logged in, reject with http error 301
*/

var passport = require("passport");

var Auth = function(req, res, next){
    
}

Auth.prototype.checkUser = function(){
    return true;
}

module.exports = Auth;
