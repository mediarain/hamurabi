'use strict';

var template = require('../services/template.js'),
    _ = require('lodash'),
    Promise = require('bluebird');

module.exports = function (responses, variables) {

  return function (msgPath) {
    var data = Array.prototype.slice.call(arguments,1);
    var msg = _.clone(_.at(responses, msgPath)[0]),
        toRender = ['ask', 'tell', 'say', 'reprompt', 'card'];
    if(msgPath && !msg) throw new Error('Could not find response '+msgPath);

    return Promise.all(_(toRender).map(function (key) {
      var statement = _.at(msg, key)[0];
      if (!statement) return null;
      if (key == 'card') return renderCard(msg.card);
      return render(statement, data).then(function (rendered) {
        return msg[key] = rendered;
      });
    }).compact().value()).then(function () {
      return msg;
    });

    function renderCard(card) {
      if (!card || card.type != 'Simple' || !card.content) return;
      return render(card.content, data).then(function (val) {
        card.content = val;
      });
    }
  };

  function render(statement, data) {
    var tokens = template.tokens(statement),
        qVariables = tokens.map(function (token) {
      var variable = variables[token];
      if (!variable) return Promise.reject(new Error('No such variable ' + token));
      return Promise.try(function () {
        return variable.apply(variables,data);
      });
    }),
        qAll = Promise.all(qVariables);
    return qAll.then(function (vars) {
      var tokensWithVars = _.zip(tokens, vars),
          vars = _.fromPairs(tokensWithVars);
      return template(statement, vars);
    });
  }
};
