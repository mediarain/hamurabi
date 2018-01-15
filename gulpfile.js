"use strict";

const gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , debug = require('gulp-debug') // eslint-disable-line no-unused-vars
  , rimraf = require('gulp-rimraf')
  , UtteranceExpaander = require('alexa-utterance-expander')
  , run = require('gulp-run')
  , fs = require('fs')
  , path = require('path')
;

gulp.task('watch', function (cb) {
  nodemon({
    script: 'src/www/server.js',
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

gulp.task('upload',function(){
  return run('ask deploy -t lambda').exec()
});

gulp.task('compile', function (cb) {
  fs.readFile(path.join(__dirname,'speechAssets','SampleUtterances-src.txt'),function(err,file){
    if(err) return cb(err);
    var expanded = UtteranceExpaander(file);
    fs.writeFile(path.join(__dirname,'speechAssets','SampleUtterances.txt'),expanded,cb);
  });
});
