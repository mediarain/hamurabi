'use strict';
const alexa = require('alexa-statemachine')
  , config = require('../config')
  , Model = require('../services/HammurabiGame')
  , responses = require('./responses')
  , variables = require('./variables')
;

const skill = new alexa.StateMachineSkill(config.alexa.appId, {
  Model,
  variables,
  views: responses
});

require('./plugins/tracker')(skill);
require('./plugins/voicelabs')(skill,config.voiceinsights);
require('./events')(skill);
require('./states')(skill);

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  if(config.alexa.verbose) {
    //console.log('Request Received');
    //console.log(JSON.stringify(event,null,2));
    context = loggedContext(context);
  }
  skill.execute(event, context)
  .then(context.succeed)
  .catch(context.fail)
};

function loggedContext(context) {
  return {
    fail: function(e) {
      console.log("Operation failed:");
      console.log(JSON.stringify(e,null,2));
      context.fail(e);
    },
    succeed: function(res) {
      console.log("Operation succeeded:");
      console.log(JSON.stringify(res,null,2));
      context.succeed(res);
    }
  }
}
