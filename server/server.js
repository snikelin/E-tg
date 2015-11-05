var express = require("express"),
      app = express(),
    compression = require("compression")

app.use(compression());


if(process.env.NODE_ENV == "development"){
    app.use(express.static(__dirname+"/../app/"));
    console.log("Development mode. Serving files on "+__dirname+"/../app");
    // app.use(require('connect-livereload')({
    //     port: process.env.LIVERELOAD_PORT
    // }));
}


app.listen(process.env.PORT || 8080);
console.log("Server listening on port ", process.env.PORT || 8080);
