"use strict";

var express = require("express"),
      app = express(),
    compression = require("compression"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    auth = require("./auth");


if(process.env.NODE_ENV == "development"){
    app.use(express.static(__dirname+"/../app/"));
    console.log("Development mode. Serving files on "+__dirname+"/../app");
}
app.set('trust proxy',['loopback', 'linklocal', 'uniquelocal']);

app.use(compression());
app.use(cookieParser());
app.use(session({
  secret: 'e-tg',
  cookie: {
    secure: false, // to be set true if https available
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(auth({
  path:"/auth"
}));

app.get("/admin",auth.requirePermissions(['administrator']),function(req,res){
  res.status(200).end();
});
app.get("/admin2",auth.requirePermissions(['administrator','user']),function(req, res){

});



app.listen(process.env.PORT || 8080);
console.log("Server listening on port ", process.env.PORT || 8080);
