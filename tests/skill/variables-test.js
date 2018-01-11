const variables = require('../../skill/variables')
  , assert = require('chai').assert
  , HammurabiGame = require('../../services/HammurabiGame.js')
;

describe('variables',function(){
  describe('kingdomStatus',function(){
    it('Reports first year status',function(){
      var game = HammurabiGame.create();
      game.acresCost = 17;
      var actual = variables.kingdomStatus(game);
      assert.equal(actual,
        "HAMURABI: I BEG TO REPORT TO YOU,\n" +
        "IN YEAR 1 YOUR POPULATION IS 100.\n" +
        "THE CITY OWNS 1000 ACRES.\n" +
        "YOU HAVE 2800 BUSHELS IN STORE.\n" +
        "LAND IS TRADING AT 17 BUSHELS PER ACRE.");
    })

    it('Reports a normal year',function(){
      var game = HammurabiGame.fromData({
        population: 103,
        immigrants: 3,
        harvest: 30,
        yield: 3,
        bushels: 80,
        year: 2,
        peopleDied: 34,
        acres: 456,
        acresCost: 17
      });
      var actual = variables.kingdomStatus(game);
      assert.equal(actual,
        "HAMURABI: I BEG TO REPORT TO YOU,\n" +
        "IN YEAR 2 34 PEOPLE STARVED AND 3 PEOPLE CAME TO THE CITY.\n" +
        "POPULATION IS NOW 103.\n" +
        "THE CITY NOW OWNS 456 ACRES.\n" +
        "YOU HARVESTED 3 BUSHELS PER ACRE.\n" +
        "YOU NOW HAVE 80 BUSHELS IN STORE.\n" +
        "LAND IS TRADING AT 17 BUSHELS PER ACRE.");
    });

    it('Reports a rat year',function(){
      var game = HammurabiGame.fromData({
        population: 103,
        immigrants: 3,
        harvest: 30,
        yield: 3,
        eaten: 30,
        bushels: 80,
        year: 2,
        peopleDied: 34,
        acres: 456,
        acresCost: 17
      });
      var actual = variables.kingdomStatus(game);
      assert.equal(actual,
        "HAMURABI: I BEG TO REPORT TO YOU,\n" +
        "IN YEAR 2 34 PEOPLE STARVED AND 3 PEOPLE CAME TO THE CITY.\n" +
        "POPULATION IS NOW 103.\n" +
        "THE CITY NOW OWNS 456 ACRES.\n" +
        "YOU HARVESTED 3 BUSHELS PER ACRE.\n" +
        "RATS ATE 30 BUSHELS.\n" +
        "YOU NOW HAVE 80 BUSHELS IN STORE.\n" +
        "LAND IS TRADING AT 17 BUSHELS PER ACRE.");
    });

    it('Reports a plague year',function(){
      var game = HammurabiGame.fromData({
        population: 103,
        immigrants: 3,
        harvest: 30,
        bushels: 80,
        year: 2,
        peopleDied: 34,
        acres: 456,
        acresCost: 17,
        hadPlague: true,
      });
      var actual = variables.kingdomStatus(game);
      assert.equal(actual,
        "HAMURABI: I BEG TO REPORT TO YOU,\n" +
        "IN YEAR 2 34 PEOPLE STARVED AND 3 PEOPLE CAME TO THE CITY.\n" +
        "A HORRIBLE PLAGUE STRUCK! HALF THE PEOPLE DIED.\n" +
        "POPULATION IS NOW 103.\n" +
        "THE CITY NOW OWNS 456 ACRES.\n" +
        "YOU HARVESTED NO BUSHELS PER ACRE.\n" +
        "YOU NOW HAVE 80 BUSHELS IN STORE.\n" +
        "LAND IS TRADING AT 17 BUSHELS PER ACRE.");
    });
  });
});
