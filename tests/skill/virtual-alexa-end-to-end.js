const assert = require('chai').assert
  , va = require('virtual-alexa')
;

const alexa = va.VirtualAlexa.Builder()
  .handler("skill/index.handler") // Lambda function file and name
  .intentSchemaFile("./speechAssets/IntentSchema.json") // Path to IntentSchema.json
  .sampleUtterancesFile("./speechAssets/SampleUtterances.txt") // Path to SampleUtterances
  .create();

describe('bespoken',function(){
  it('launches and says welcome',function(){
    return alexa.launch().then(res => {
      assert.match(res.response.outputSpeech.ssml,/Welcome/i);
      assert.include(res.response.outputSpeech.ssml,'100'); //Init population
      assert.equal(res.sessionAttributes.state,'query-action');
    });
  })

  it('buy-valid',function() {
    return alexa.launch().then(() => alexa.utter('buy 5 acres of land'))
    .then(res => {
      assert.match(res.response.outputSpeech.ssml,/You're buying 5 acres./i);
      assert.equal(res.sessionAttributes.state,'query-action');
      assert.equal(res.sessionAttributes.modelData.command.buy,5);
      assert.equal(res.sessionAttributes.modelData.year,1);
    });
  });

  it('buy-error-bushels',function(){
    return alexa.launch().then(() => alexa.utter('buy {500} acres of land'))
    .then(res => {
      assert.match(res.response.outputSpeech.ssml,/The most you .* buy is \d+ acres/i);
      assert.equal(res.sessionAttributes.state,'query-action');
      assert.notOk(res.sessionAttributes.modelData.command.buy);
      assert.equal(res.sessionAttributes.modelData.year,1);
    });
  });

});
