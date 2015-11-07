/*
    Author: Beeven Yip
    Modified: Nov 5, 2015

    auth module: If the user is no logged in, reject with http error 301
*/
"use strict";

var passport = require("passport"),
    EtgStrategy = require("./strategy"),
    express = require("express"),
    router = express.Router();


var Auth = function(options){
  options = options || {};

  passport.use(new EtgStrategy());

  router.get(options.path+"/login",passport.authenticate('etg'));
  router.get(options.path+"/logout",function(req, res){
    req.logOut();
    res.end();
  });

  return function(req, res, next){
    passport.initial()(req,res,next);
    passport.session()(req,res,next);
    router(req,res,next);
    next();
  };
};

Auth.permissionCheckType = {
  atLeastOne: 0,
  combinationRequired :1
};


Auth.requirePermissions = function(permissions,permissionCheckType){
  if(Array.isArray(permissions) === false) {
    permissions = [permissions];
  }
  permissionCheckType = permissionCheckType || Auth.permissionCheckType.atLeastOne;
  return function(req,res,next){
    if(!req.user) {
      res.status(401).end(); // unauthorized
    } else if(permissions.length === 0){
      return next();
    } else if(permissionCheckType == Auth.permissionCheckType.atLeastOne) {
      for(let p of permissions){
        if(req.user.permissions.indexOf(p) > -1){
          return next();
        }
      }
      res.status(403).end(); // forbiden
    } else if(permissionCheckType == Auth.permissionsCheckType.combinationRequired){
      for(let p of permissions) {
        if(req.user.peprmissions.indexOf(p) === -1){
          res.status(403).end(); // forbiden
          return;
        }
      }
      return next();
    } else {
      res.status(403).end();
    }
  };
};

module.exports = Auth;
