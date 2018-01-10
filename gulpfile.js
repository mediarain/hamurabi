"use strict";

var gulp = require('gulp')
    , watch = require('gulp-watch')
    , runSequence = require('run-sequence')
    , nodemon = require('gulp-nodemon')
    , debug = require('gulp-debug')
    , rimraf = require('gulp-rimraf')
    , UtteranceExpaander = require('alexa-utterance-expander')
    , zip = require('gulp-zip')
    , run = require('gulp-run')
    , fs = require('fs')
    , path = require('path')
  ;

gulp.task('watch', function (cb) {
  nodemon({
    script: 'www/server.js',
    watch: ['www/*','config/*','services/*','skill/*'],
    ext: 'json js',
    ignore: ['node_modules/**/*']
  });
});

gulp.task('clean',function(){
  return gulp.src('archives').pipe(rimraf());
})

gulp.task('run', function(cb){
  require('./www/server.js');
});

gulp.task('default',['run'], function (cb) {
});

gulp.task('upload',['zip'],function(cb){
    run('aws lambda update-function-code --profile rainlabs --function-name Hamurabi --zip-file fileb://archives/archive.zip').exec()
        .pipe(gulp.dest('output'));
});

gulp.task('zip',['clean'], function(cb){
  return gulp.src(['**/*','archives/*.zip','!node_modules/gulp*/**/*','!node_modules/run-sequence/**/*','!node_modules/mocha/**/*'])
    //.pipe(debug('in-archive'))
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('archives'));
});

 gulp.task('compile', function (cb) {
   fs.readFile(path.join(__dirname,'speechAssets','SampleUtterances-src.txt'),function(err,file){
     if(err) return cb(err);
     var expanded = UtteranceExpaander(file);
     fs.writeFile(path.join(__dirname,'speechAssets','SampleUtterances.txt'),expanded,cb);
   });
 });
