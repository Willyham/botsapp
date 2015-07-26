'use strict';

var Buffertools = require('buffertools');
var extend = require('xtend');

module.exports = {

  /**
   * Create a trigger which matches some text
   * @param {String} text Text to match
   * @param {Object} options options
   * @param {Boolean} [options.caseSensitive=false] Match case sensitive, default false
   * @returns {Trigger} this object for chaining
   * @constructor
   */
  withText: function matchingText(text, options) {
    options = options || {};
    options = extend({
      caseSensitive: false
    }, options);

    return function matcher(event) {
      if (!event.body) {
        return false;
      }
      if (!options.caseSensitive) {
        return event.body.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      }
      return event.body.indexOf(text) !== -1;
    };
  },

  withRegex: function withRegex(regex) {
    return function matcher(event) {
      if (!event.body) {
        return false;
      }
      return regex.test(event.body);
    };
  },

  withEmoji: function containingEmoji(emoji) {
    return function matcher(event) {
      if (!event.body) {
        return false;
      }
      var bodyBuffer = new Buffer(event.body);
      return Boolean(Buffertools.indexOf(bodyBuffer, emoji) !== -1);
    };
  }

};
