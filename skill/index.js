'use strict';
const Voxa = require('voxa')
  , config = require('../config')
  , Model = require('../services/HammurabiGame')
  , responses = require('./responses')
  , variables = require('./variables')
;

const skill = new Voxa({
  Model,
  variables,
  views: responses
});

require('./plugins/tracker')(skill);
//require('./plugins/voicelabs')(skill,config.voiceinsights);
require('voxa-opearlo')(skill,config.opearlo);
require('voxa-ga')(skill,config.google_analytics);
require('./events')(skill);
require('./states')(skill);

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context, done) {
  if(config.alexa.verbose) {
    //console.log('Request Received');
    console.log(JSON.stringify(event,null,2));
    context = loggedContext(context, done);
  }
  skill.execute(event, context)
    .then(res => {
      done(null,res.toJSON())
    })
  .catch(done)
};

function loggedContext(context, done) {
  return {
    fail: function(e) {
      console.log("Operation failed:");
      console.log(JSON.stringify(e,null,2));
      done(e);
    },
    succeed: function(res) {
      console.log("Operation succeeded:");
      console.log(JSON.stringify(res,null,2));
      done(null,res);
    }
  }
}
