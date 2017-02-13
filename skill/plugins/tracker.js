'use strict';
const colors = require('colors/safe');
const _ = require('lodash');

colors.setTheme({
  info: 'magenta',
  error: 'red',
})

function info() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.info(x)).join(' ');
  console.log(str);
}

function error() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.error(x)).join(' ');
  console.log(str);
}

module.exports = function(skill){

  skill.onSessionStarted(function(request,reply){
    info('New session for',request.user.userId);
  })

  skill.onSessionEnded(function(request,reply){
    info('End session for',request.user.userId);
  })

  skill.onRequestStarted(function(request,reply) {
    if(request.type == 'IntentRequest') {
      let slots = Object.keys(request.intent.params).length > 0 ? JSON.stringify(request.intent.params) : '';
      let state = request.session.attributes.state || 'entry';
      info(`Got ${request.intent.name}${slots} in state [${state}]`)
    }
    else {
      info('Got request ', request.type)
    }
  })

  skill.onAfterStateChanged(function(request,reply, trans) {
    let from = _.last(request.flow);
    if(trans.reply)
      info(`${from} => ${trans.to} and say ${trans.reply}`)
    else
      info(`${from} => ${trans.to}`)
  })

  skill.onBeforeReplySent(function(request,reply, trans) {})

  skill.onError(function(request, err) {
    error('Fatal Error');
    error(err.stack);
  })

  skill.onStateMachineError(function(request,reply, err) {
   error(err.stack || err)
  })

}
