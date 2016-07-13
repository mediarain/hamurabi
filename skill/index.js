'use strict';
var StateMachineSkill = require('./StateMachineSkill.js')
  , HammurabiStateMachine = require('./HammurabiStateMachine.js')
  , config = require('../config')
;

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  if(config.alexa.verbose) {
    console.log('Request Received');
    console.log(JSON.stringify(event,null,2));
    context = loggedContext(context);
  }
  var skill = new StateMachineSkill(config.alexa.appId, HammurabiStateMachine);
  skill.execute(event, context);
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
