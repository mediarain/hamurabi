'use strict';
var Reply = require('alexa-stateMachine').Reply
  , config = require('../config')
  , _ = require('lodash')
  , verbose = config.verbose
  , HammurabiGame = require('../services/HammurabiGame')
  , Command = require('../services/Command')
  , gameParams = config.game
;

module.exports = function(skill) {

  skill.onState('entry',{
    to: {
      'LaunchIntent': 'launch',
      'AMAZON.HelpIntent': 'cold-help',
      'AMAZON.StartOverIntent': 'query-startover',
      'AMAZON.StopIntent': 'query-exit'
    }
  });

  skill.onState('query-startover',function(request) {
    var hasPriorGame = !!request.session.attributes.game;
    if(hasPriorGame) return {reply: 'StartOverQuery', to: 'startover'};
    else return {to: 'launch'};
  });

  skill.onState('startnew',function(request) {
    if(request.intent.name == 'AMAZON.YesIntent') {
      delete request.session.attributes.game;
      delete request.session.attributes.command;
      return {reply: 'StartNew', to: 'launch' };
    }
    else if(request.intent.name == 'AMAZON.NoIntent') {
      return {to: 'report'};
    }
  });

  skill.onState('startover',function(request) {
    if(request.intent.name == 'AMAZON.YesIntent') {
      delete request.session.attributes.game;
      delete request.session.attributes.command;
      return { reply: 'StartOver', to: 'launch' };
    }
    else if(request.intent.name == 'AMAZON.NoIntent') {
      return { to:'report'};
    }
  });

  skill.onState('query-exit',function(request) {
    return {reply:'ExitQuery', to: 'exit'};
  });

  skill.onState('exit',function(request) {
    if(request.intent.name == 'AMAZON.YesIntent') {
      return {reply: 'Goodbye',to: 'die' };
    }
    else if(request.intent.name == 'AMAZON.NoIntent') {
      return {reply: null,to: 'report'};
    }
  });

  skill.onState('cold-help',function(request) {
    return {reply: 'Help.ExplainGame', to: 'startnew'};
  });

  skill.onState('launch',function(request) {
    var hasPriorGame = !!request.session.attributes.game;
    if(hasPriorGame) return {to: 'query-startover'};
    request.model = HammurabiGame.create();
    return {reply: 'Welcome',to: 'report'};
    });

  skill.onState('report',function(request) {
    var game = request.model;
    if(game.year >= 11 || game.hasRevolt)  return {reply: 'FinalReport',to: 'die'};
    return {reply: 'Report',to: 'query-action'};
  })
  skill.onState('action',function(request) {
    return {reply: 'Actions.PromptMore',to: 'query-action'};
  });
  skill.onState('query-action', function(request) {
    var game = request.model;
    var command = game.command;
    if(request.intent.name == 'BuyIntent' || request.intent.name == 'SellIntent') {
      var acres = +request.intent.params.acresCnt
        , isSell = request.intent.name == 'SellIntent'
        , action = isSell ? 'Sell' : 'Buy'
      ;
      if(isSell) acres *= -1;
      command.attemptedBuy = acres;
      if(command.error = command.buyError(game,acres)) return {reply: 'Actions.Errors.' + action +'.'+command.error, to: 'action'};
      command.buy = acres;
      return {reply: 'Actions.Validate.' + action, to: 'action'};
    }
    else if(request.intent.name == 'BuyWithRestIntent') {
      var acres = +command.mostCanBuy(game) ;
      command.buy = acres;
      if(!acres) return {reply: 'Actions.Errors.BuyWithRest.InsufficientBushels',to: 'action'};
      return {reply: 'Actions.Validate.BuyWithRest',to: 'action'};
    }
    else if(request.intent.name == 'FeedPeopleIntent') {
      var feed = +request.intent.params.peopleCnt;
      command.attemptedFeed = feed;
      if(command.error = command.feedError(game,feed)) {
        if(command.error == "InsufficientBushelsWithCommand"){
          var buyPhrase = command.buy < 0 ? 'WithSell' : command.buy > 0 ? 'WithBuy' : '';
          return {reply: 'Actions.Errors.Feed.'+command.error+buyPhrase,to: 'action'};
        }
        return {reply: 'Actions.Errors.Feed.'+command.error,to: 'action'};

        return {reply: 'Actions.Errors.Feed.'+command.error+buyPhrase,to: 'action'};
      }
      command.feed = feed;
      return {reply: 'Actions.Validate.Feed',to: 'action'};
    }
    else if(request.intent.name == 'FeedEveryoneIntent') {
      var feed = command.mostCanFeed(game);
      command.feed = feed;
      if(feed == 0) return {reply: 'Actions.Errors.FeedEveryone',to: 'action'};
      else if (feed == game.population) return {reply: 'Actions.Validate.FeedEveryone',to: 'action'};
      return {reply: 'Actions.Validate.FeedRest',to: 'action'};
    }
    else if(request.intent.name == 'FeedNoOneIntent') {
      command.feed = 0;
      return {reply: 'Actions.Validate.FeedNoOne',to: 'action'};
    }
    else if(request.intent.name == 'PlantIntent') {
      var plant = +request.intent.params.plantCnt;
      command.attemptedPlant = plant;
      if(command.error = command.plantError(game,plant)) {
        var buyPhrase = command.buy < 0 ? 'WithSell' : command.buy > 0 ? 'WithBuy' : ''
        return {reply: 'Actions.Errors.Plant.'+command.error+buyPhrase,to: 'action'};
      }
      command.plant = plant;
      return {reply: 'Actions.Validate.Plant',to: 'action'};
    }
    else if(request.intent.name == 'PlantAllIntent') {
      var plant = command.mostCanPlant(game);
      command.plant = plant;
      if(plant == 0) return {reply: 'Actions.Errors.PlantAll',to: 'action'};
      else if (command.bushelsLeft(game) && plant == game.acres) return {reply: 'Actions.Validate.PlantAll',to: 'action'};
      else if (  plant == game.population * gameParams.acresPersonWorks ) return {reply: 'Actions.Validate.PlantRestWorkersLimited',to: 'action'};
      return {reply: 'Actions.Validate.PlantRestBushelsLimited',to: 'action'};
    }
    else if(request.intent.name == 'PlantNothingIntent') {
      command.plant = 0;
      return {reply: 'Actions.Validate.PlantNothing',to: 'action'};
    }
    else if(request.intent.name == "AMAZON.RepeatIntent") {
      return {to: 'report'};
    }
    else if(request.intent.name == "NextYearIntent") {
      request.model = game.iterate(command);
      return {to: 'report'};
    }
    else if(request.intent.name == "AMAZON.HelpIntent") { return {reply: "Help.ExplainActions",to: 'action'}; }
    else if(request.intent.name == "AMAZON.CancelIntent") { return {reply: "Cancel",to: 'action'}; }
    else if(request.intent.name == 'ActionsQueryIntent') { return {reply: 'Query.Actions',to: 'action'}; }
    else if(request.intent.name == 'AcresCostQueryIntent') { return {reply: 'Query.AcresCost',to: 'action'}; }
    else if(request.intent.name == 'AcresQueryIntent') { return {reply: 'Query.Acres',to: 'action'}; }
    else if(request.intent.name == 'PopulationQueryIntent') { return {reply: 'Query.Population',to: 'action'}; }
    else if(request.intent.name == 'WaitIntent') { return {reply: 'Wait',to: 'action'}; }
  });
};
