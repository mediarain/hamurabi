'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path'),
    config = require('../config'),
    env = require('../config/env.js'),
    skillRoute = require('./routes/skill.js')
    ;

console.log('Attempting to start.\r\n\t'
            + 'Node version: '
            + process.version
            + '\r\n\tNODE_ENV: '
            + env);
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/skill',skillRoute.router);

var server = http.createServer(app);
server.listen(config.server.port, function () {
  console.log('Server listening on port %d.', config.server.port);
});
