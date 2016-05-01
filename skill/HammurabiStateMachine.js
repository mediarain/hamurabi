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
  , gameParams = config.game
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
      to: {
        'LaunchIntent': 'launch',
        'AMAZON.HelpIntent': 'cold-help',
        'AMAZON.StartOverIntent': 'query-startover',
        'AMAZON.StopIntent': 'query-exit'
      }
    },
    'query-startover': {
      enter: function(request) {
        var hasPriorGame = !!request.session.attributes.game;
        if(hasPriorGame) return replyWith('StartOverQuery','startover',request);
        else return replyWith(null,'launch',request);
      }
    },
    'startover': {
      enter: function(request) {
        if(request.intent.name == 'AMAZON.YesIntent') {
          delete request.session.attributes.game;
          delete request.session.attributes.command;
          return replyWith('StartOver','launch',request);
        }
        else if(request.intent.name == 'AMAZON.NoIntent') {
          return replyWith(null,'report',request);
        }
      }
    },
    'query-exit': {
      enter: function(request) {
        return replyWith('ExitQuery','exit',request);
      }
    },
    'exit': {
      enter: function(request) {
        if(request.intent.name == 'AMAZON.YesIntent') {
          return replyWith('Goodbye','die',request);
        }
        else if(request.intent.name == 'AMAZON.NoIntent') {
          return replyWith(null,'report',request);
        }
      }
    },
    'cold-help': {
      enter: function(request) {
        return replyWith('Help.ExplainGame','startover',request,game, cmd);
      }
    },
    'launch': {
      enter: function(request) {
        var hasPriorGame = !!request.session.attributes.game;
        if(hasPriorGame) return replyWith(null,'query-startover', request);
        var game = HammurabiGame.create();
        var cmd = new Command();
        return replyWith('Welcome','report',request,game, cmd);
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
          var acres = +request.intent.params.acresCnt
            , isSell = request.intent.name == 'SellIntent'
            , action = isSell ? 'Sell' : 'Buy'
          ;
          if(isSell) acres *= -1;
          command.attemptedBuy = acres;
          if(command.error = command.buyError(game,acres)) return replyWith('Actions.Errors.' + action +'.'+command.error,'action',request,game,command);
          command.buy = acres;
          return replyWith('Actions.Validate.' + action,'action',request,game,command);
        }
        else if(request.intent.name == 'BuyWithRestIntent') {
          var acres = +command.mostCanBuy(game) ;
          command.buy = acres;
          if(!acres) return replyWith('Actions.Errors.BuyWithRest.InsufficientBushels','action',request,game,command);
          return replyWith('Actions.Validate.BuyWithRest','action',request,game,command);
        }
        else if(request.intent.name == 'FeedPeopleIntent') {
          var feed = +request.intent.params.peopleCnt;
          command.attemptedFeed = feed;
          if(command.error = command.feedError(game,feed)) {
            if(command.error == "InsufficientBushelsWithCommand"){
              var buyPhrase = command.buy < 0 ? 'WithSell' : command.buy > 0 ? 'WithBuy' : '';
              return replyWith('Actions.Errors.Feed.'+command.error+buyPhrase,'action',request,game,command);
            }
            return replyWith('Actions.Errors.Feed.'+command.error,'action',request,game,command);

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
          else if (command.bushelsLeft(game) && plant == game.acres) return replyWith('Actions.Validate.PlantAll','action',request,game,command);
          else if (  plant == game.population * gameParams.acresPersonWorks ) return replyWith('Actions.Validate.PlantRestWorkersLimited','action',request,game,command);
          return replyWith('Actions.Validate.PlantRestBushelsLimited','action',request,game,command);
        }
        else if(request.intent.name == 'PlantNothingIntent') {
          command.plant = 0;
          return replyWith('Actions.Validate.PlantNothing','action',request,game,command);
        }
        else if(request.intent.name == "AMAZON.RepeatIntent") {
          return replyWith(null,'report',request,game,command);
        }
        else if(request.intent.name == "NextYearIntent") {
          game = game.iterate(command);
          return replyWith(null,'report',request,game, new Command());
        }
        else if(request.intent.name == "AMAZON.HelpIntent") { return replyWith("Help.ExplainActions",'action',request,game,command); }
        else if(request.intent.name == "AMAZON.CancelIntent") { return replyWith("Cancel",'action',request,game,new Command()); }
        else if(request.intent.name == 'ActionsQueryIntent') { return replyWith('Query.Actions','action',request,game,command); }
        else if(request.intent.name == 'AcresCostQueryIntent') { return replyWith('Query.AcresCost','action',request,game,command); }
        else if(request.intent.name == 'AcresQueryIntent') { return replyWith('Query.Acres','action',request,game,command); }
        else if(request.intent.name == 'PopulationQueryIntent') { return replyWith('Query.Population','action',request,game,command); }
        else if(request.intent.name == 'WaitIntent') { return replyWith('Wait','action',request,game,command); }
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
