var fs = require('fs')
  , path = require('path')
  , config = require('../../config')
  , skill = require('../../skill')
  , assert = require('chai').assert
;

describe('end to end',function(){
  this.timeout(1000000);

  itIs('launch',function(res){
    assert.match(res.response.outputSpeech.ssml,/Welcome/i);
    assert.include(res.response.outputSpeech.ssml,'100'); //Init population
    assert.equal(res.sessionAttributes.state,'query-action');
  })

  itIs('buy-valid',function(res){
    assert.match(res.response.outputSpeech.ssml,/You're buying 5 acres./i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.equal(res.sessionAttributes.command.buy,5);
    assert.equal(res.sessionAttributes.game.year,1);
  });

  itIs('buy-error-bushels',function(res){
    assert.match(res.response.outputSpeech.ssml,/The most you .* buy is \d+ acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.command.buy);
    assert.equal(res.sessionAttributes.game.year,1);
  });

  itIs('buy-error-bushels-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/40 acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.command.buy);
    assert.equal(res.sessionAttributes.command.feed,100);
    assert.equal(res.sessionAttributes.game.year,1);
  });

  itIs('sell-error-acres-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/planting 999 acres/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.command.buy);
    assert.equal(res.sessionAttributes.command.plant,999);
    assert.equal(res.sessionAttributes.game.year,1);
  });

  itIs('plant-error-bushels-with-command',function(res){
    assert.match(res.response.outputSpeech.ssml,/800 bushels/i);
    assert.equal(res.sessionAttributes.state,'query-action');
    assert.notOk(res.sessionAttributes.command.plant);
    assert.equal(res.sessionAttributes.game.year,1);
  });

  itIs('feed-everyone',function(res){
    assert.equal(res.sessionAttributes.command.feed,90);
    assert.match(res.response.outputSpeech.ssml,/90 people/i);
    assert.match(res.response.outputSpeech.ssml,/10 people will starve/i);
  });

  itIs('end-game-revolt',function(res){
    assert.match(res.response.outputSpeech.ssml,/YOU STARVED 100 PEOPLE IN ONE YEAR!/i);
  });

  function itIs(requestFile, cb) {
    it(requestFile,function(done){
      var event = require('./requests/'+requestFile  + '.js');
      event.session.application.applicationId = config.alexa.appId;
      skill.handler(event, {
        succeed: function(response){
          try{ cb(response); }
          catch(e) { return done (e);}
          done();
        },
        fail: done
      });
    });
  }
});
