var config = require('../config/')
  , _ = require('lodash')
  , gameParams = config.game
;

var ERRORS = {
  NEGATIVE: 'Negative',
  EXCESSIVE_ACRES: 'ExcessiveAcres',
  EXCESSIVE_ACRES_WITH_COMMAND: 'ExcessiveAcresWithCommand',
  INSUFFICIENT_ACRES: 'InsufficientAcres',
  INSUFFICIENT_ACRES_WITH_COMMAND: 'InsufficientAcresWithCommand',
  INSUFFICIENT_BUSHELS: 'InsufficientBushels',
  INSUFFICIENT_BUSHELS_WITH_COMMAND: 'InsufficientBushelsWithCommand',
  INSUFFICIENT_PEOPLE: 'InsufficientPeople',
};

function Command(vals) {
  _.assign(this,vals);
  this.buy = this.buy || 0;
  this.feed = this.feed || 0;
  this.plant = this.plant || 0;
}

Command.prototype.bushelsLeft= function(state) {
  return state.bushels - this.feed * gameParams.bushelsToFeedPerson - this.plant - this.buy * state.acresCost ;
}

Command.prototype.mostCanBuy= function(state) {
  return Math.floor( (state.bushels - this.feed * gameParams.bushelsToFeedPerson - this.plant) / state.acresCost  );
}

Command.prototype.mostCanFeed = function(state) {
  return Math.min(Math.floor( (state.bushels - this.buy * state.acresCost - this.plant) / gameParams.bushelsToFeedPerson ),state.population);
}

Command.prototype.mostCanSell= function(state) {
  return state.acres - this.plant;
}

Command.prototype.mostCanPlant= function(state) {
  return Math.min( state.acres + this.buy, state.population * gameParams.acresPersonWorks, state.bushels - this.buy * state.acresCost - this.feed * gameParams.bushelsToFeedPerson);
}

Command.prototype.buyError= function(state,toBuy) {
  var cmd = this;
  if(toBuy < 0) {
    if(toBuy * -1 > state.acres) return ERRORS.EXCESSIVE_ACRES;
    if(toBuy * -1 + cmd.plant > state.acres) return ERRORS.EXCESSIVE_ACRES_WITH_COMMAND;
  } else {
    if(toBuy * state.acresCost  > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS;
    if(toBuy * state.acresCost + cmd.plant + cmd.feed * gameParams.bushelsToFeedPerson > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS_WITH_COMMAND;
  }
}

Command.prototype.feedError = function(state,toFeed) {
  var cmd = this;
  if(toFeed < 0) return ERRORS.NEGATIVE;
  if(toFeed > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS;
  if(toFeed + cmd.plant * gameParams.bushelsToFeedPerson + cmd.buy * state.acresCost > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS_WITH_COMMAND;
}

Command.prototype.plantError = function(state,toPlant) {
  var cmd = this;
  if(toPlant < 0) return ERRORS.NEGATIVE;
  if(toPlant > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS;
  if(toPlant + cmd.feed * gameParams.bushelsToFeedPerson + cmd.buy * state.acresCost > state.bushels) return ERRORS.INSUFFICIENT_BUSHELS_WITH_COMMAND;
  if(toPlant > state.population * gameParams.acresPersonWorks) return ERRORS.INSUFFICIENT_PEOPLE;
  if(toPlant > state.acres) return ERRORS.INSUFFICIENT_ACRES;
  if(toPlant > state.acres + cmd.buy) return ERRORS.INSUFFICIENT_ACRES_WITH_COMMAND;
}

module.exports = Command;
module.exports.ERRORS = ERRORS;
