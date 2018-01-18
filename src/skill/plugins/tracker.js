'use strict';
const colors = require('colors/safe');
const _ = require('lodash');

colors.setTheme({
  info: 'magenta',
  audio: 'cyan',
  error: 'red',
  warning: 'yellow',
})

function info() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.info(x)).join(' ');
  console.log(str);
}

function audio() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.audio(x)).join(' ');
  console.log(str);
}

function error() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.error(x)).join(' ');
  console.log(str);
}

function warning() {
  let args = Array.prototype.slice.call(arguments);
  let str = args.map(x => colors.warning(x)).join(' ');
  console.log(str);
}

module.exports = function(skill){

  skill.onSessionStarted(function(event,reply){
    info('New session for',event.user.userId);
  })

  skill.onSessionEnded(function(event,reply){
    info('End session for',event.user.userId);
  })

  skill.onRequestStarted(function(event,reply) {
    const fromState = event.session.new ? 'entry' : event.session.attributes.state || 'entry';
    event['tracker-flow'] = [fromState];
    if(event.request.type === 'IntentRequest') {
      let slots = Object.keys(event.intent.params).length > 0 ? JSON.stringify(event.intent.params) : '';
      info(`Got ${event.intent.name}${slots} in state [${fromState}]`)
    }
    else {
      info('Got request ', event.request.type)
    }
  })

  skill.eventHandlers.onAfterStateChanged.unshift(function(event,reply, trans) {
    if(!trans) {
      return;
    }
    let from = _.last(event['tracker-flow']) || 'entry';
    event['tracker-flow'].push(trans.to);
    if(trans.reply)
      info(`${from} => ${trans.to} and say ${trans.reply}`)
    else
      info(`${from} => ${trans.to}`)
  });

  skill.onBeforeReplySent(function(event,reply, trans) {})

  skill.onError(function(event, err) {
    error('Fatal Error');
    if(_.isString(err)) error(err);
    else error(err.stack);
  })

  skill.onUnhandledState(function(event) {
    info('No handler found')
  })

  /********************* Audio Events *********************/

  skill['onAudioPlayer.PlaybackStopped'](function(event){
    audio(`Playback Stopped ${event.context.AudioPlayer.token} at ${event.context.AudioPlayer.offsetInMilliseconds}`);
  })

  skill['onAudioPlayer.PlaybackFailed'](function(event){
    error(`Playback Failed ${event.context.AudioPlayer.token} at ${event.context.AudioPlayer.offsetInMilliseconds}`);
  })

  skill['onAudioPlayer.PlaybackStarted'](function(event){
    audio(`Playback Started ${event.context.AudioPlayer.token} at ${event.context.AudioPlayer.offsetInMilliseconds}`);
  })

  skill['onAudioPlayer.PlaybackNearlyFinished'](function(event){
    audio(`Playback Nearly Finished ${event.context.AudioPlayer.token} at ${event.context.AudioPlayer.offsetInMilliseconds}`);
  })

  skill['onAudioPlayer.PlaybackFinished'](function(event){
    audio(`Playback Finished ${event.context.AudioPlayer.token} at ${event.context.AudioPlayer.offsetInMilliseconds}`);
  })
}

module.exports.info = info;
module.exports.audio = audio;
module.exports.error = error;
module.exports.warning = warning;
