'use strict';

var assert = require('chai').assert
  , HammurabiGame = require('../../src/services/HammurabiGame.js')
  , Command = require('../../src/services/Command.js')
  ;

describe('HammurabiGame', function () {
  describe('iterate', function () {
    it('iterates for a single year',function(){
      var start = HammurabiGame.create();
      start.acresCost = 17;
      var actual = start.iterate(new Command({plant: 0, feed: 100, buy: 0, migrantRoll: 1, ratsRoll: 2, yieldRoll: 1, plagueRoll: .5}))
      assert.equal(103,actual.population);
      assert.equal(3,actual.immigrants);
      assert.equal(0,actual.harvest);
      assert.equal(800,actual.bushels);
      assert.equal(0,actual.eaten);
      assert.equal(2,actual.year);
      assert.equal(0,actual.peopleDied);
      assert.equal(0,actual.totalDied);
      assert.equal(0,actual.percentPopDied);
      assert.isFalse(actual.hadPlague);
    });
    it('does rats',function(){
      var start = HammurabiGame.create();
      start.acresCost = 17;
      var actual = start.iterate(new Command({plant: 0, feed: 100, buy: 0, migrantRoll: 1, ratsRoll: 3, yieldRoll: 1, plagueRoll: .5}))
      assert.equal(103,actual.population);
      assert.equal(3,actual.immigrants);
      assert.equal(0,actual.harvest);
      assert.equal(534,actual.bushels);
      assert.equal(266,actual.eaten);
      assert.equal(2,actual.year);
      assert.equal(0,actual.peopleDied);
      assert.equal(0,actual.totalDied);
      assert.equal(0,actual.percentPopDied);
      assert.isFalse(actual.hadPlague);
    })
    it('does plague',function(){
      var start = HammurabiGame.create();
      start.acresCost = 17;
      var actual = start.iterate(new Command({plant: 0, feed: 100, buy: 0, migrantRoll: 1, ratsRoll: 2, yieldRoll: 1, plagueRoll: .05}))
      assert.equal(2,actual.year);
      assert.equal(53,actual.population);
      assert.equal(3,actual.immigrants);
      assert.equal(0,actual.peopleDied);
      assert.equal(0,actual.totalDied);
      assert.equal(0,actual.percentPopDied);
      assert.isTrue(actual.hadPlague);
    })
  });
});

