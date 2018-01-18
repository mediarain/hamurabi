'use strict';
const Voxa = require('voxa')
  , config = require('../config')
  , Model = require('../services/HammurabiGame')
  , responses = require('./responses')
  , variables = require('./variables')
  , bst = require('bespoken-tools')
;


// Create the handler that responds to the Alexa Request.
//exports.handler = bst.Logless.capture(config.logless, alexaSkill.lambda());

exports.alexa = (event, context, callback) => {

  const app = new Voxa({
    Model,
    variables,
    views: responses
  });

  //require('./plugins/voicelabs')(app,config.voiceinsights);
  //require('voxa-opearlo')(app,config.opearlo);
  //require('voxa-ga')(app,config.google_analytics);

  const alexaSkill = new Voxa.Alexa(app);

  require('./plugins/tracker')(app);
  require('./events')(app);
  require('./states')(app);

  alexaSkill.lambda()(event, context, callback);
};
