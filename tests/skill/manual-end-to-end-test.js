var config = require('../../src/config')
  , skill = require('../../src/skill')
  , assert = require('chai').assert
;

describe('end to end',function(){

  itIs('launch',function(res){
    assert.match(res.response.outputSpeech.ssml,/Welcome/i);
    assert.include(res.response.outputSpeech.ssml,'100'); //Init population
    assert.equal(res.sessionAttributes.state,'query-action');
  })

  itIs('buy-valid',function(res){
    assert.match(res.response.outputSpeech.ssml,/You're buying 5 acres./i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.equal(res.sessionAttributes.modelData.command.buy,5);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('buy-error-bushels',function(res){
    assert.match(res.response.outputSpeech.ssml,/The most you .* buy is \d+ acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.modelData.command.buy);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('buy-error-bushels-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/40 acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.modelData.command.buy);
    assert.equal(res.sessionAttributes.modelData.command.feed,100);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('buy-with-rest',function(res){
    assert.match(res.response.outputSpeech.ssml,/With the rest of your bushels, you buy 164 acres./i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.equal(res.sessionAttributes.modelData.command.buy,164);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('sell-error-acres-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/planting 999 acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.modelData.command.buy);
    assert.equal(res.sessionAttributes.modelData.command.plant,999);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('feed-everyone',function(res){
    assert.equal(res.sessionAttributes.modelData.command.feed,90);
    assert.match(res.response.outputSpeech.ssml,/90 people/i);
    assert.match(res.response.outputSpeech.ssml,/10 people will starve/i);
  });

  itIs('end-game-revolt',function(res){
    assert.match(res.response.outputSpeech.ssml,/YOU STARVED 100 PEOPLE IN ONE YEAR!/i);
  });

  itIs('does-not-error-when-selling-lots',function(res){
    assert.isFalse(res.response.shouldEndSession);
    assert.equal(res.sessionAttributes.modelData.year,4);
    assert.equal(res.sessionAttributes.modelData.acres,938);
  });

  itIs('cold-help',function(res){
    assert.match(res.response.outputSpeech.ssml,/Hammurabi is one of the first games made for terminal computers/i);
  });

  itIs('plant/error-bushels-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/800 bushels/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.modelData.command.plant);
    assert.equal(res.sessionAttributes.modelData.year,1);
  });

  itIs('plant/all-acres-limited',function(res){
    assert.equal(res.sessionAttributes.modelData.command.plant,1000);
    assert.match(res.response.outputSpeech.ssml,/You're planting all 1000 acres and have 1800 bushels/i);
  });

  itIs('plant/all-bushels-limited',function(res){
    assert.equal(res.sessionAttributes.modelData.command.plant,500);
    assert.match(res.response.outputSpeech.ssml,/With the rest of your bushels, you plant 500 acres/i);
  });

  itIs('plant/all-workers-limited',function(res){
    assert.equal(res.sessionAttributes.modelData.command.plant,200);
    assert.match(res.response.outputSpeech.ssml,/You plant 200 acres/);
    assert.match(res.response.outputSpeech.ssml,/most you can work with 20 people/);
    assert.match(res.response.outputSpeech.ssml,/you have 2600 bushels left/i);
    assert.match(res.response.outputSpeech.ssml,/and 800 unused acres/i);
  });

  itIs('plant/nothing',function(res){
    assert.equal(res.sessionAttributes.modelData.command.plant,0);
    assert.match(res.response.outputSpeech.ssml,/You plant nothing. I fear/);
  });

  itIs('query/action',function(res){
    assert.match(res.response.outputSpeech.ssml,/You're buying 2 acres/i);
    assert.match(res.response.outputSpeech.ssml,/You're planting 20 acres/i);
    assert.match(res.response.outputSpeech.ssml,/You're feeding 20 people/i);
    assert.match(res.response.outputSpeech.ssml,/2340/i);
  });

  itIs('query/population',function(res){
    assert.match(res.response.outputSpeech.ssml,/You have 100 people in your kingdom/i);
  });

  itIs('query/acres-cost',function(res){
    assert.match(res.response.outputSpeech.ssml,/Land costs 20 bushels per acre/i);
    assert.match(res.response.outputSpeech.ssml,/You can afford to buy up to 140 acres/i);
  });


  function itIs(requestFile, cb) {
    it(requestFile,function(done){
      var event = require('./requests/'+requestFile  + '.js');
      event.session.application.applicationId = config.alexa.appId;
      skill.handler(event, {
        awsRequestId: 'mocked',
      }, function(err,res){
        if(err) return done(err);
        try{ cb(res); }
        catch(e) { return done(e);}
        done();
      });
    });
  }
});
