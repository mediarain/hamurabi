'use strict';
var Reply = require('voxa').Reply
  , _ = require('lodash')
;

module.exports = function(skill) {

  skill.onBeforeReplySent(function(request, reply) {
    var reprompt = reply.msg.reprompt;
    if (reprompt) {
      request.session.attributes.reprompt = reprompt;
      return;
    }
    request.session.attributes.reprompt = null;
  })


  skill.onUnhandledState(function(request) {
    var reprompt = request.session.attributes.reprompt;
    if (reprompt) { return { ask: reprompt }; }
    return {reply: 'Errors.BadLaunch'};
  })

  skill.onStateMachineError(function onError(request, error) {
    return new Reply(request,{
      tell: "Oh no! You're empire was destroyed by a devastating " +
           _.sample(['fire','earthquake','hurricane','tornado','tsunami','meteor strike','alien invasion','mole men attack','sneeze. It was pretty incredible'])
          + ". Try again."
    });
  })

}
