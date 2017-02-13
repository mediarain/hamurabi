'use strict'
const VoiceInsights = require('voice-insights-sdk')
const _ = require('lodash');

module.exports = function(skill,config) {

  if(!config.token) throw new Error('Token is required to register voice labs');

  skill.onAfterStateChanged(function(request,reply,trans){
    if(!trans.reply) return;
    reply.paths = reply.paths || [];
    reply.paths.push(trans.reply);
  })

  skill.onSessionStarted(function(request,reply){
  })

  skill.onBeforeReplySent(function(request, reply) {
    let msg = reply.render().say.speech;
    VoiceInsights.initialize(request.session,config.token); //The VoiceInsights library uses global state to track the session id :( so we register the session before each track event
    VoiceInsights.track(_.last(reply.paths),request.intent.slots,msg);
  })

}

