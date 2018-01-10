const fs = require('fs')
  , path = require('path')
  , config = require('../../config')
  , skill = require('../../skill')
  , assert = require('chai').assert
  , bst = require('bespoken-tools')
  , Promise = require('bluebird')
;

describe('bespoken',function(){
  this.timeout(1000000);
  let server = null, alexa = null;

  beforeEach(done => {
    server = new bst.LambdaServer('./skill/index.js', 10000, true);
    alexa = new bst.BSTAlexa('http://localhost:10000');
    Promise.promisifyAll(alexa);
    alexa.start(error => {
      if(error) {
        console.log('Error starting alexa',error)
        return done(error);
      }
      server.start(error => {
        if(error) {
          console.log('Error starting server',error)
          return done(error);
        }
        done();
      });
    });
  });

  afterEach(done => {
    alexa.stop(error => {
      if(error) {
        console.log('Error stopping alexa',error)
        return done(error);
      }
      server.stop(error => {
        if(error) {
          console.log('Error stopping server',error)
          return done(error);
        }
        done();
      });
    });
  });

  it('launches and says welcome',function(){
    return alexa.launchedAsync().then(res => {
      assert.match(res.response.outputSpeech.ssml,/Welcome/i);
      assert.include(res.response.outputSpeech.ssml,'100'); //Init population
      assert.equal(res.sessionAttributes.state,'query-action');
    });
  })

  it('buy-valid',function() {
    return alexa.launchedAsync().then(() => alexa.spokenAsync('buy {5} acres of land'))
    .then(res => {
      assert.match(res.response.outputSpeech.ssml,/You're buying 5 acres./i);
      assert.equal(res.sessionAttributes.state,'query-action');
      assert.equal(res.sessionAttributes.modelData.command.buy,5);
      assert.equal(res.sessionAttributes.modelData.year,1);
    });
  });

  it('buy-error-bushels',function(){
    return alexa.launchedAsync().then(() => alexa.spokenAsync('buy {500} acres of land'))
    .then(res => {
      assert.match(res.response.outputSpeech.ssml,/The most you .* buy is \d+ acres/i);
      assert.equal(res.sessionAttributes.state,'query-action');
      assert.notOk(res.sessionAttributes.modelData.command.buy);
      assert.equal(res.sessionAttributes.modelData.year,1);
    });
  });

});
