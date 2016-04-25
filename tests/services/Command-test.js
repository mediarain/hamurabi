'use strict';

var assert = require('chai').assert
  , HammurabiGame = require('../../services/HammurabiGame.js')
  , Command = require('../../services/Command.js')
  ;

describe('Command', function () {
  describe('mostCanBuy', function () {
    itIs(2000,0,0,20,100);
    itIs(2000,1,0,21,94);
    itIs(2000,0,1,20,99);


    function itIs(bushels,feed,plant,acresCost,expect) {
      it('Have: ' + bushels + '. Feed: ' + feed + ' Plant: ' + plant + ' Acres Cost: ' + acresCost + ' => ' + expect,function() {
        var cmd = new Command({feed: feed, plant: plant});
        var actual = cmd.mostCanBuy({bushels: bushels, acresCost: acresCost})
        assert.equal(actual,expect);
      })
    }
  });

  describe('mostCanFeed', function () {
    itIs(2000,0,0,20,100);
    itIs(2000,1,0,20,99);
    itIs(2000000,0,0,0,200);

    function itIs(bushels,buy,plant,acresCost,expect) {
      it('Have: ' + bushels + '. Buy: ' + buy + ' Plant: ' + plant + ' Acres Cost: ' + acresCost + ' => ' + expect,function() {
        var cmd = new Command({buy: buy, plant: plant});
        var actual = cmd.mostCanFeed({bushels: bushels, acresCost: acresCost, population: 200})
        assert.equal(actual,expect);
      });
    }
  });

  describe('mostCanPlant', function () {
    itIs(3000,0,0,0, 200,1000); // Acres limited
    itIs(2000,0,75,0, 200,500); // Bushel limited
    itIs(2000,0,75,0, 10,100); // Worker limited limited

    function itIs(bushels,buy,feed,acresCost, population,expect) {
      it('Have: ' + bushels + '. Buy: ' + buy + ' Feed: ' + feed + ' Acres Cost: ' + acresCost + ' Population: ' + population + '=> ' + expect,function() {
        var cmd = new Command({buy: buy, feed: feed});
        var actual = cmd.mostCanPlant({bushels: bushels, acresCost: acresCost, population: population, acres: 1000})
        assert.equal(actual,expect);
      });
    }
  });
});

