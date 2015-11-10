/*
    Author: Beeven Yip
    Modified: Nov 5, 2015

    auth module: If the user is no logged in, reject with http error 301
*/
"use strict";

var passport = require("passport"),
    EtgStrategy = require("./strategy"),
    express = require("express"),
    account = require("./account"),
    router = express.Router();


var Auth = function(options){
    //console.log("creating auth");
  options = options || {};
  options.path = options.path || '/auth';

  // user our strategy
  passport.use(new EtgStrategy(function(loginInfo, done){
      //console.log("loginInfo:",loginInfo);
      if(loginInfo.loginType === EtgStrategy.loginType.email){
          account.findByEmail(loginInfo.email,loginInfo.password)
            .then(function(user){
              done(null,user);
          },function(err){
              done(null,false,'not found');
          });
      } else if (loginInfo.loginType === EtgStrategy.loginType.IKey) {
          account.findBySerial(loginInfo.serial)
            .then(function(user){
                done(null,user);
            },function(err){
                done(null,false,'not found');
            });
      } else {
          done("LoginType not allowed",false);
      }
  }));

  // implement serialize & deserialize for sessions to work
  passport.serializeUser(function(user,done){
      //console.log("Serializing",user);
      done(null,user.id);
  });
  passport.deserializeUser(function(user,done){
      //console.log("deserializing",userid);
      done(null,user);
  });

  router.post(options.path+"/login",function(req,res,next){
      passport.authenticate('etg',function(err,user){
          //console.log("auth success",err,user);
          if(err){ return next(err); }
          if(!user){
              return res.json({status:"fail",statusText:"Information incorrect"});
          }
          req.logIn(user,function(err){
              //console.log("req.logIn",err,user);
              if(err) { return next(err);}
              return res.json({status:"success", user: {id: user.id, name:user.name, permissions:user.permissions}});
          });
      })(req,res,next);
  });
  router.post(options.path+"/logout",function(req, res){
    req.logOut();
    res.status(200).end();
  });



  return chainMiddleware(
      passport.initialize(),
      passport.session(),
      router
  );
};

Auth.permissionCheckType = {
  atLeastOne: 0,
  combinationRequired :1
};

function chainMiddleware(){
    var middlewares = Array.prototype.slice.call(arguments,0);
    return function(req, res, next){
        function createNext(middlewareFunc, i){
            return function(err){
                if(err) return next(err);
                var nextIndex = i + 1,
                    nextMiddleware = middlewares[nextIndex] ? createNext(middlewares[nextIndex],nextIndex) : next;
                try {
                    middlewareFunc(req, res, nextMiddleware);
                }
                catch(e){
                    next(e);
                }
            };
        }
        return createNext(middlewares[0],0)();
    };
}


Auth.prototype.requirePermissions = function(permissions,permissionCheckType){
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
