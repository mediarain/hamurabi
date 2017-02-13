'use strict';
var StateMachine = require('alexa-statemachine').stateMachine
  , Reply = require('alexa-stateMachine').Reply
  , config = require('../config')
  , _ = require('lodash')
  , verbose = config.verbose
;

module.exports = function(skill) {

  skill.onBeforeReplySent(function(request, reply) {
    if (reply) {
      var reprompt = reply.msg.reprompt;
      if (reprompt) {
        request.session.attributes.reprompt = reprompt;
        return;
      }
    }
    request.session.attributes.reprompt = null;
  })


  //skill.onUnhandledState(function(request) {
  skill.onBadResponse(function(request) {
    var reprompt = request.session.attributes.reprompt;
    if (reprompt) { return { ask: reprompt }; }
    //TODO: Is this reply object still valid?
    return new Reply(request,_.get(responses, 'Errors.BadLaunch'));
  })

  skill.onError(function onError(request, error) {
    return new Reply(request,{
      tell: "Oh no! You're empire was destroyed by a devastating " +
           _.sample(['fire','earthquake','hurricane','tornado','tsunami','meteor strike','alien invasion','mole men attack','sneeze. It was pretty incredible'])
          + ". Try again."
    });
  })

}
