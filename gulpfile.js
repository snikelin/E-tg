var gulp = require('gulp');
var stylus = require("gulp-stylus");
var gls = require("gulp-live-server");
var testServer = require('karma').Server;
var mocha = require("gulp-mocha");

var paths = {
  stylus: ['app/css/**/*.styl']
};

gulp.task('default', ['stylus']);

gulp.task('stylus', function(done) {
  gulp.src('app/css/app.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('app/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.stylus, ['stylus']);
});

gulp.task('serve',['watch'], function(){
    var server = gls('server/server.js',{env:{NODE_ENV: 'development', PORT:'8080'}});
    server.start();
    gulp.watch(['app/**/*.css','app/**/*.html','app/**/*.js','!app/**/*.spec.js'], function(file){
        console.log("file change detected, reloading")
        server.notify.apply(server,[file]);
    });
    gulp.watch(['server/**/*.js','!server/**/*.spec.js'], function(){
        server.start.bind(server)();
    })
});

gulp.task('test_app',function(done){
    new testServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test_server',function(){
    gulp.src("server/tests/**/*.test.js",{read:false})
        .pipe(mocha({
            reporter: 'spec',
            require: ['chai']
        }));
});

gulp.task('test',['test_server','test_app']);
