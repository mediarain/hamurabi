'use strict';

var _ = require('lodash')
  , Promise = require('bluebird')
  , lang = require('./lang.js')
  , gameParams = require('../config').game
  ;

exports.mostCanBuyAcres = function(game,cmd) {
  return lang.quantify(cmd.mostCanBuy(game),'acre');
}

exports.mostCanSellAcres = function(game,cmd) {
  return lang.quantify(cmd.mostCanSell(game),'acre');
}

exports.leastCanSellAcres = function(game,cmd) {
  return lang.quantify(cmd.leastCanSell(game),'acre');
}

exports.mostCanFeedPeople = function(game,cmd) {
  return lang.quantify(cmd.mostCanFeed(game),'person','people');
}

exports.mostCanPlantAcres = function(game,cmd) {
  return lang.quantify(cmd.mostCanPlant(game),'acre');
}

exports.mostCanPlantBushels = function(game,cmd) {
  return lang.quantify(cmd.mostCanPlant(game),'bushel');
}

exports.acresCost = function(game,cmd) {
  return lang.quantify(game.acresCost,'bushel');
}

exports.buyAcres = function(game,cmd) {
  return lang.quantify(Math.abs(cmd.buy),'acre');
}

exports.sellAcres = function(game,cmd) {
  return lang.quantify(-1 * cmd.buy,'acre');
}

exports.attemptedSellAcres = function(game,cmd) {
  return lang.quantify(-1 * cmd.attemptedBuy,'acre');
}

exports.buyBushels = function(game,cmd) {
  return lang.quantify(cmd.buy * game.acresCost,'bushel');
}

exports.sellBushels = function(game,cmd) {
  return lang.quantify(-1 * cmd.buy * game.acresCost,'bushel');
}

exports.feedPeople = function(game,cmd) {
  return lang.quantify(cmd.feed,'person','people');
}

exports.starvePeople = function(game,cmd) {
  return lang.quantify(game.population - cmd.feed,'person','people');
}

exports.populationPeople = function(game,cmd) {
  return lang.quantify(game.population,'person','people');
}

exports.feedBushels = function(game,cmd) {
  return lang.quantify(cmd.feed * gameParams.bushelsToFeedPerson,'bushel');
}

exports.plantAcres = function(game,cmd) {
  return lang.quantify(cmd.plant,'acre');
}

exports.plantBushels = function(game,cmd) {
  return lang.quantify(cmd.plant,'bushel');
}

exports.bushels = function(game,cmd) {
  return lang.quantify(game.bushels,'bushel');
}

exports.acres = function(game,cmd) {
  return lang.quantify(game.acres,'acre');
}

exports.bushelsUnused = function(game,cmd) {
  return lang.quantify(cmd.bushelsLeft(game),'unused bushel');
}

exports.bushelsLeft = function(game,cmd) {
  return lang.quantify(cmd.bushelsLeft(game),'bushel') + ' left';
}

exports.bushelsRemaining = function(game,cmd) {
  return lang.quantify(cmd.bushelsLeft(game),'remaining bushel');
}

exports.commandStatus = function(game,cmd) {
  var statements = [];
  if(cmd.buy > 0) statements.push("You're buying " + exports.buyAcres(game,cmd) +'.')
  if(cmd.buy < 0) statements.push("You're selling " + exports.buyAcres(game,cmd) +'.')
  if(cmd.plant) statements.push("You're planting " + exports.plantAcres(game,cmd) +'.')
  if(cmd.feed) statements.push("You're feeding " + exports.feedPeople(game,cmd) +'.')

  if(!statements.length) return "You've got no plans yet this year and have " + exports.bushels(game,cmd) +  ".";
  return statements.join('\n') + "\nYou've got " + exports.bushelsRemaining(game,cmd)+".";
}

exports.kingdomStatus = function(game) {
  if(game.year == 1) {
    return "HAMURABI: I BEG TO REPORT TO YOU,\n" +
  "IN YEAR " + game.year +" YOUR POPULATION IS " + game.population + ".\n" +
  "THE CITY OWNS " + acres(game.acres) + ".\n" +
  ( game.year != 1 ?"YOU HARVESTED " + bushels(game.yield) +" PER ACRE.\n":'') +
  "YOU HAVE " + bushels(game.bushels) +" IN STORE.\n" +
  "LAND IS TRADING AT " + bushels(game.acresCost) + " PER ACRE."
  }

  return "HAMURABI: I BEG TO REPORT TO YOU,\n" +
"IN YEAR " + game.year +" " + people(game.peopleDied) + " STARVED AND " + people(game.immigrants) +" CAME TO THE CITY.\n" +
( game.hadPlague  ? "A HORRIBLE PLAGUE STRUCK! HALF THE PEOPLE DIED.\n" :'') +
"POPULATION IS NOW " + game.population + ".\n" +
"THE CITY NOW OWNS " + acres(game.acres) + ".\n" +
( game.year != 1 ?"YOU HARVESTED " + bushels(game.yield) +" PER ACRE.\n":'') +
( game.eaten ?"RATS ATE " + bushels(game.eaten) +".\n":'') +
"YOU NOW HAVE " + bushels(game.bushels) +" IN STORE.\n" +
"LAND IS TRADING AT " + bushels(game.acresCost) + " PER ACRE."
          ;
}

exports.finalKingdomStatus = function(game) {
  var despedida ="SO LONG FOR NOW."
    , loseMsg =
      "DUE TO THIS EXTREME MISMANAGEMENT YOU HAVE NOT ONLY\n" +
      "BEEN IMPEACHED AND THROWN OUT OF OFFICE BUT YOU HAVE\n" +
      "ALSO BEEN DECLARED NATIONAL FINK!!\n" + despedida
  , acresPerPerson = Math.round(game.acres / game.population)
;

  if(game.hasRevolt) {
    return "YOU STARVED " + people(game.peopleDied) + " IN ONE YEAR!!!\n" + loseMsg;
  }
  var msg =
"IN YOUR 10-YEAR TERM OF OFFICE, " + game.percentPopDied.toFixed(0) + " PERCENT OF THE\n" +
"POPULATION STARVED PER YEAR ON AVERAGE, I.E., A TOTAL OF " + people(game.peopleDied) + " DIED!!\n"+
"YOU STARTED WITH 10 ACRES PER PERSON AND ENDED WITH " + acresPerPerson + " ACRES PER PERSON.\n";

  if (game.percentPopDied > 33 || acresPerPerson < 7) return msg + loseMsg;
  if (game.percentPopDied > 10 || acresPerPerson < 9)
  {
    return msg + "YOUR HEAVY-HANDED PERFORMANCE SMACKS OF NERO AND IVAN IV.\n" +
      "THE PEOPLE (REMAINING) FIND YOU AN UNPLEASANT RULER, AND,\n"+
      "FRANKLY, HATE YOUR GUTS!\n" + despedida;
      ;
  }
  else if (game.percentPopDied > 3 || acresPerPerson < 10)
  {
    return msg + "YOUR PERFORMANCE COULD HAVE BEEN SOMEWHAT BETTER, BUT REALLY WASN'T TOO BAD AT ALL.\n" +
      Math.floor(game.population * .8 * Math.random() )+ " PEOPLE WOULD " +
      "DEARLY LIKE TO SEE YOU ASSASSINATED BUT WE ALL HAVE OUR " +
      "TRIVIAL PROBLEMS.\n" + despedida;
  }
  else
  {
    return msg +"A FANTASTIC PERFORMANCE!!! CHARLEMANGE, DISRAELI, AND\n" +
      "JEFFERSON COMBINED COULD NOT HAVE DONE BETTER!\n" + despedida;
  }
}

function people(cnt) {
  return !cnt ? 'NOBODY'
       : cnt == 1 ? '1 PERSON'
       : '' + cnt +' PEOPLE'
}

function acres(cnt) {
  return !cnt ? 'NO ACRES'
       : cnt == 1 ? '1 ACRE'
       : cnt <= 1 ? '1 ACRE'
       : '' + cnt +' ACRES'
}

function bushels(cnt) {
  return !cnt ? 'NO BUSHELS'
       : cnt == 1 ? '1 BUSHEL'
       : '' + cnt +' BUSHELS'
}
