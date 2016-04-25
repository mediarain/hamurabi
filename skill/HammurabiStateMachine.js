'use strict';

var StateMachine = require('./StateMachine.js')
  , Reply = require('./reply.js')
  , config = require('../config')
  , StateMachineSkill = require('./StateMachineSkill.js')
  , _ = require('lodash')
  , responses = require('./responses.js')
  , messageRenderer = require('./message-renderer.js')(responses, require('./variables.js'))
  , verbose = config.verbose
  , Promise = require('bluebird')
  , HammurabiGame = require('../services/HammurabiGame')
  , Command = require('../services/Command')
;

module.exports = StateMachine({
  onTransition: function onTransition(trans, request) {
    if (trans.reply) {
      var reprompt = trans.reply.msg.reprompt;
      if (reprompt) {
        request.session.attributes.reprompt = reprompt;
        return;
      }
    }
    request.session.attributes.reprompt = null;
  },
  onBadResponse: function onBadResponse(request) {
    var reprompt = request.session.attributes.reprompt;
    if (reprompt) { return { ask: reprompt }; }
    return _.at(responses, 'Errors.BadLaunch')[0];
  },
  onError: function onError(request, error) {
    var self = this;
    return new Reply(_.at(responses, 'Errors.General')[0]);
  },
  openIntent: 'LaunchIntent',
  states: {
    "die": { isTerminal: true },
    "entry": {
      to: {'LaunchIntent': 'launch'}
    },
    'launch': {
      enter: function(request) {
        var game = HammurabiGame.create();
        return replyWith('Welcome','report',request,game);
      }
    },
    'report': {
      enter: function(request) {
        var game = make(request);
        if(game.year >= 11 || game.hasRevolt) return replyWith('FinalReport','die',request,game);
        return replyWith('Report','query-action',request,game);
      }
    },
    'action': {
      enter: function(request) {
        var game = make(request);
        var command = cmdmake(request);
        return replyWith('Actions.PromptMore','query-action',request,game,command);
      }
    },
    'query-action': {
      enter: function(request) {
        var game = make(request);
        var command = cmdmake(request);
        if(request.intent.name == 'BuyIntent' || request.intent.name == 'SellIntent') {
          var acres = +request.intent.params.acresCnt;
          if(request.intent.name == 'SellIntent') acres *= -1;
          command.attemptedBuy = acres;
          if(command.error = command.buyError(game,acres)) return replyWith('Actions.Errors.Buy.'+command.error,'action',request,game,command);
          command.buy = acres;
          return replyWith('Actions.Validate.Buy','action',request,game,command);
        }
        else if(request.intent.name == 'FeedPeopleIntent') {
          var feed = +request.intent.params.peopleCnt;
          command.attemptedFeed = feed;
          if(command.error = command.feedError(game,feed)) {
            var buyPhrase = command.buy < 0 ? 'WithSell' : command.buy > 0 ? 'WithBuy' : ''
            return replyWith('Actions.Errors.Feed.'+command.error+buyPhrase,'action',request,game,command);
          }
          command.feed = feed;
          return replyWith('Actions.Validate.Feed','action',request,game,command);
        }
        else if(request.intent.name == 'FeedEveryoneIntent') {
          var feed = command.mostCanFeed(game);
          command.feed = feed;
          if(feed == 0) return replyWith('Actions.Errors.FeedEveryone','action',request,game,command);
          else if (feed == game.population) return replyWith('Actions.Validate.FeedEveryone','action',request,game,command);
          return replyWith('Actions.Validate.FeedRest','action',request,game,command);
        }
        else if(request.intent.name == 'FeedNoOneIntent') {
          command.feed = 0;
          return replyWith('Actions.Validate.FeedNoOne','action',request,game,command);
        }
        else if(request.intent.name == 'PlantIntent') {
          var plant = +request.intent.params.plantCnt;
          command.attemptedPlant = plant;
          if(command.error = command.plantError(game,plant)) {
            var buyPhrase = command.buy < 0 ? 'WithSell' : command.buy > 0 ? 'WithBuy' : ''
            return replyWith('Actions.Errors.Plant.'+command.error+buyPhrase,'action',request,game,command);
          }
          command.plant = plant;
          return replyWith('Actions.Validate.Plant','action',request,game,command);
        }
        else if(request.intent.name == 'PlantAllIntent') {
          var plant = command.mostCanPlant(game);
          command.plant = plant;
          if(plant == 0) return replyWith('Actions.Errors.PlantAll','action',request,game,command);
          else if (feed == game.acres) return replyWith('Actions.Validate.PlantAll','action',request,game,command);
          return replyWith('Actions.Validate.PlantRest','action',request,game,command);
        }
        else if(request.intent.name == "AMAZON.RepeatIntent") {
          return replyWith(null,'report',request,game,command);
        }
        else if(request.intent.name == "NextYearIntent") {
          game = game.iterate(command);
          return replyWith(null,'report',request,game,command);
        }
        else if(request.intent.name == "AMAZON.RepeatIntent") {
          return replyWith(null,'report',request,game,command);
        }
      }
    }
  }
});

function make(request) {
  return HammurabiGame.fromData(request.session.attributes.game);
}

function cmdmake(request) {
  return new Command(request.session.attributes.command);
}


function replyWith(msgPath, state, request, game, command) {
  if (verbose) console.log('Move to state [' + state + '] and say ' + msgPath);
  return renderMessage(msgPath, game, command).then(function (msg) {
    return {
      message: msg,
      to: state,
      session: {
        game: game ? game.serialize() : request.session.attributes.game,
        command: command ? command : request.session.attributes.command,
        startTimestamp: request.session.attributes.startTimestamp
      }
    };
  });
}

function renderMessage(msgPath, game, cmd) {
  if (!msgPath) return Promise.resolve(null);
  return messageRenderer(msgPath, game, cmd);
}
