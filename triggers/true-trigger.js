'use strict';

var util = require('util');
var Trigger = require('./trigger');

/**
 * Create a trigger which always matches an event
 * Useful if you want to capture everything
 * @constructor
 */
function TrueTrigger() {
  var matcher = function matcher() {
    return true;
  };
  Trigger.call(this, matcher);
}

util.inherits(TrueTrigger, Trigger);

module.exports = TrueTrigger;
