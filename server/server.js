"use strict";

var express = require("express"),
    app = express(),
    compression = require("compression"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    auth = require("./auth");


if (process.env.NODE_ENV == "development") {
    app.use(express.static(__dirname + "/../app/"));
    console.log("Development mode. Serving files on " + __dirname + "/../app");
}
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'e-tg',
    cookie: {
        secure: false, // to be set true if https available
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    saveUninitialized: true,
    resave: true
}));

app.use(auth({
    path: "/auth"
}));






//
// var passport = require("passport"),
//     EtgStrategy = require("./auth/strategy"),
//     account = require("./auth/account");
//
// passport.use(new EtgStrategy(function(loginInfo, done){
//     if(loginInfo.loginType === EtgStrategy.loginType.email){
//         account.findByEmail(loginInfo.email,loginInfo.password)
//           .then(function(user){
//             done(null,user);
//         },function(err){
//             done(err,false);
//         });
//     } else if (loginInfo.loginType === EtgStrategy.loginType.IKey) {
//         account.findBySerial(loginInfo.serial)
//           .then(function(user){
//               done(null,user);
//           },function(err){
//               done(err,false);
//           });
//     } else {
//         done("LoginType not allowed",false);
//     }
// }));
//
// // implement serialize & deserialize for sessions to work
// passport.serializeUser(function(user,done){
//     console.log("Serializing",user);
//     done(null,user.id);
// });
// passport.deserializeUser(function(userid,done){
//     console.log("deserializing",userid);
//     done(null,userid);
// });
//
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.post("/auth/login",function(req,res,next){
//     passport.authenticate('etg',function(err,user){
//         console.log("auth success",err,user);
//         if(err){ return next(err); }
//         if(!user){
//             return res.json({status:"fail",statusText:"Information incorrect"});
//         }
//       //   else {
//       //       console.log("sending success");
//       //       return res.json({status:"success",user:{name:user.name,id:user.id,permissions:user.permissions}});
//       //   }
//         req.logIn(user,function(err){
//             console.log("req.logIn",err,user);
//             if(err) { return next(err);}
//             return res.json({status:"success", user: {id: user.id, name:user.name, permissions:user.permissions}});
//         });
//     })(req,res,next);
// },function(req,res){
//     console.log("I'm here");
// });
// app.post("/auth/logout",function(req, res){
//   req.logOut();
//   res.status(200).end();
// });
//
//
//
//
//
//
//

















app.listen(process.env.PORT || 8080);
console.log("Server listening on port ", process.env.PORT || 8080);
