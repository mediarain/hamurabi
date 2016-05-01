"use strict";

var gulp = require('gulp')
    , watch = require('gulp-watch')
    , runSequence = require('run-sequence')
    , concat = require('gulp-concat')
    , rename = require('gulp-rename')
    , nodemon = require('gulp-nodemon')
    , debug = require('gulp-debug')
    , rimraf = require('gulp-rimraf')
    , UtteranceExpaander = require('alexa-definition-author/utterances/UtteranceExpander')
    , fs = require('fs')
    , path = require('path')

    , src = 'www/public-src/'
    , dest = 'www/public/'
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
  return gulp.src(dest).pipe(rimraf());
})

gulp.task('run', function(cb){
  require('./www/server.js');
});

gulp.task('default',['run'], function (cb) {
});

gulp.task('compile', function (cb) {
  fs.readFile(path.join(__dirname,'interaction-model','utterances-src.txt'),function(err,file){
    if(err) return cb(err);
    var expanded = UtteranceExpaander(file);
    fs.writeFile(path.join(__dirname,'interaction-model','utterances.txt'),expanded,cb);
  });
});
