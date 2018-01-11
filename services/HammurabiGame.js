'use strict'
var config = require('../config')
  , _ = require('lodash')
  , gameParams = config.game
  , Command = require('./Command')
;

class HammurabiGame {

  constructor (state) {
    _.assign(this,state);
    this.command = new Command(state ? state.command : null);
  }

  serialize() {
    return this;
  }

  iterate(cmd) {
    var prior = this;
    if(prior.hasRevolt) return prior;
    var next = new HammurabiGame({
      year: prior.year + 1,
      population: prior.population,
      bushels: prior.bushels,
      acres: prior.acres,
      eaten: 0
    });

    var err = cmd.buyError(prior,cmd.buy);
    if(err) throw new Error(err);
    next.acres += cmd.buy;
    next.bushels -= prior.acresCost * cmd.buy;
    err = cmd.feedError(prior,cmd.feed);
    if(err) throw new Error(err);
    next.bushels -= cmd.feed * gameParams.bushelsToFeedPerson;
    err = cmd.plantError(prior,cmd.plant);
    if(err) throw new Error(err);
    next.bushels -= cmd.plant;
    next.yield = cmd.yieldRoll || _.random(1,5);
    next.harvest = cmd.plant * next.yield;
    next.acresCost = cmd.acreCost || _.random(17, 28);
    // Rats
    var rand = cmd.ratsRoll || _.random(1,5);
    if (rand % 2 === 1) {
      next.eaten = Math.floor(next.bushels / rand);
    }
    next.bushels = next.bushels - next.eaten + next.harvest;
    rand = cmd.migrantRoll || _.random(1,5);
    next.immigrants = Math.floor(rand * (gameParams.bushelsToFeedPerson * next.acres + next.bushels) / next.population / 100 + 1);
    // *** HOW MANY PEOPLE HAD FULL TUMMIES?
    var fedPeople = Math.min(cmd.feed,prior.population);
    // *** STARVE ENOUGH FOR IMPEACHMENT?
    next.peopleDied = prior.population - fedPeople;
    next.percentPopDied = (prior.year * prior.percentPopDied + next.peopleDied * 100 / prior.population) / next.year;
    next.totalDied = prior.totalDied + next.peopleDied;
    if (next.peopleDied > .45 * prior.population) {
      next.hasRevolt = true;
      return next;
    }
    next.population = fedPeople;
    // REM *** HORRORS, A 15% CHANCE OF PLAGUE
    next.hadPlague = (cmd.plagueRoll || Math.random()) <= .15;
    if (next.hadPlague) {
      next.population = Math.floor(next.population / 2);
    }
    next.population += next.immigrants;
    return next;
  }

  get acresPerPerson() {
    return Math.round(this.acres / (this.population || 1 ))
  }

  get ranking() {
    if (this.percentPopDied > 33 || this.acresPerPerson < 7) return 'lose';
    if (this.percentPopDied > 10 || this.acresPerPerson < 9) return 'worst';
    if (this.percentPopDied > 3 || this.acresPerPerson < 10) return 'ok';
    return 'best';
  }

  static fromEvent(event) {
    return this.fromData(_.get(event,'session.attributes.modelData'))
  }

  static fromData(data) {
    return new HammurabiGame(data);
  }

  static create() {
    var state = _.cloneDeep(config.game.init);
    state.acresCost = _.random(17, 28);
    return new HammurabiGame(state);
  }
}

module.exports = HammurabiGame;
