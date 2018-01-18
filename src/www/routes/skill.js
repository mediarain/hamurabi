'use strict';

var router = exports.router = require('express').Router()
  , skill = require('../../skill')
  , config = require('../../config')
;

exports.mountPath = '/skill';

if (config.server.hostSkill) {
  router.post('/', function (req, res, next) {
    skill.alexa(req.body, {
      awsRequestId: 'mocked',
      fail: e => {
        res.status(500);
        res.json(e);
      },
      succeed: function succeed(msg) {
        res.json(msg);
      }
    },function(err,msg){
      if(err) {
        res.status(500);
        res.json(err);
      }
      else {
        res.json(msg);
      }
    });
  });
}
