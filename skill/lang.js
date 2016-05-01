'use strict';

var _ = require('lodash');
var vowels = ['a', 'e', 'i', 'o', 'u'];

exports.an = function (word) {
  if (vowels.indexOf(word[0].toLowerCase()) >= 0) return 'an';
  return 'a';
};

exports.quantify = function (quantity, word, plural) {
  if (quantity > 1 || quantity < 1) return '' + quantity + ' ' + (plural || exports.pluralize(word));
  if (!quantity) return 'no ' + (plural || exports.pluralize(word));
  return '1' + ' ' + word;
};

exports.enumerate = function (words) {
  if (words.length == 0) return '';
  if (words.length == 1) return words[0];
  if (words.length == 2) return words[0] + ' and ' + words[1];
  return _.take(words, words.length - 1).join(', ') + ', and ' + words[words.length - 1];
};

exports.pluralize = function (word) {
  return word + 's';
};
