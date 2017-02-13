'use strict';

var router = exports.router = require('express').Router(),
    skill = require('../../skill'),
    config = require('../../config');

exports.mountPath = '/skill';

if (config.server.hostSkill) {
  router.post('/', function (req, res, next) {
    skill.handler(req.body, {
      fail: e => {
        res.status(500);
        res.json(e);
      },
      succeed: function succeed(msg) {
        //if(config.verbose) console.log('Skill yields',JSON.stringify(msg,null,2));
        res.json(msg);
      }
    });
  });
}
