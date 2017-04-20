'use strict';

var _ = require('lodash')
  , Promise = require('bluebird')
  , lang = require('alexa-helpers').lang
  , gameParams = require('../config').game
  ;

exports.accident = function(game) {
  return _.sample(['fire','earthquake','hurricane','tornado','tsunami','alien invasion','mole men attack']);
}

exports.mostCanBuyAcres = function(game) {
  return lang.quantify(game.command.mostCanBuy(game),'acre');
}

exports.mostCanSellAcres = function(game) {
  return lang.quantify(game.command.mostCanSell(game),'acre');
}

exports.leastCanSellAcres = function(game) {
  return lang.quantify(game.command.leastCanSell(game),'acre');
}

exports.mostCanFeedPeople = function(game) {
  return lang.quantify(game.command.mostCanFeed(game),'person','people');
}

exports.mostCanPlantAcres = function(game) {
  return lang.quantify(game.command.mostCanPlant(game),'acre');
}

exports.mostCanPlantBushels = function(game) {
  return lang.quantify(game.command.mostCanPlant(game),'bushel');
}

exports.acresCost = function(game) {
  return lang.quantify(game.acresCost,'bushel');
}

exports.buyAcres = function(game) {
  if(game.command.buy === 0) return 'no acres';
  return lang.quantify(Math.abs(game.command.buy),'acre');
}

exports.sellAcres = function(game) {
  if(game.command.buy === 0) return 'no acres';
  return lang.quantify(-1 * game.command.buy,'acre');
}

exports.attemptedSellAcres = function(game) {
  return lang.quantify(-1 * game.command.attemptedBuy,'acre');
}

exports.buyBushels = function(game) {
  return lang.quantify(game.command.buy * game.acresCost,'bushel');
}

exports.sellBushels = function(game) {
  return lang.quantify(-1 * game.command.buy * game.acresCost,'bushel');
}

exports.feedPeople = function(game) {
  return lang.quantify(game.command.feed,'person','people');
}

exports.starvePeople = function(game) {
  return lang.quantify(game.population - game.command.feed,'person','people');
}

exports.populationPeople = function(game) {
  return lang.quantify(game.population,'person','people');
}

exports.feedBushels = function(game) {
  return lang.quantify(game.command.feed * gameParams.bushelsToFeedPerson,'bushel');
}

exports.plantAcres = function(game) {
  return lang.quantify(game.command.plant,'acre');
}

exports.plantBushels = function(game) {
  return lang.quantify(game.command.plant,'bushel');
}

exports.bushels = function(game) {
  return lang.quantify(game.bushels,'bushel');
}

exports.acres = function(game) {
  return lang.quantify(game.acres,'acre');
}

exports.acresUnused = function(game) {
  return lang.quantify(game.command.acresLeft(game),'unused acres');
}

exports.bushelsUnused = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'unused bushel');
}

exports.bushelsLeft = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'bushel') + ' left';
}

exports.bushelsRemaining = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'remaining bushel');
}

exports.commandStatus = function(game) {
  var statements = [];
  if(game.command.buy > 0) statements.push("You're buying " + exports.buyAcres(game,game.command) +'.')
  if(game.command.buy < 0) statements.push("You're selling " + exports.buyAcres(game,game.command) +'.')
  if(game.command.plant) statements.push("You're planting " + exports.plantAcres(game,game.command) +'.')
  if(game.command.feed) statements.push("You're feeding " + exports.feedPeople(game,game.command) +'.')

  if(!statements.length) return "You've got no plans yet this year and have " + exports.bushels(game,game.command) +  ".";
  return statements.join('\n') + "\nYou've got " + exports.bushelsRemaining(game,game.command)+".";
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
  , acresPerPerson = game.acresPerPerson
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
