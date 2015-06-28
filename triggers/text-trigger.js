'use strict';

var util = require('util');

var extend = require('xtend');

var Trigger = require('./trigger');

/**
 * Create a trigger which matches some text
 * @param {String} text Text to match
 * @param {Object} options options
 * @param {Boolean} [options.caseSensitive=false] Match case sensitive, default false
 * @constructor
 */
function TextTrigger(text, options) {
  options = options || {};
  options = extend({
    caseSensitive: false
  }, options);

  var self = this;
  this.text = text;
  var matcher = function matcher(event) {
    // Only match text messages
    if (!event.body) {
      return false;
    }

    if (!options.caseSensitive) {
      return event.body.toLowerCase().indexOf(self.text.toLowerCase()) !== -1;
    }
    return event.body.indexOf(self.text) !== -1;
  };
  Trigger.call(this, matcher);
}

util.inherits(TextTrigger, Trigger);

module.exports = TextTrigger;
