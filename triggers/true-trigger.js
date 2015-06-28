'use strict';

var util = require('util');
var Trigger = require('./trigger');

function TrueTrigger() {
  var matcher = function matcher(event) {
    return true;
  };
  Trigger.call(this, matcher);
}

util.inherits(TrueTrigger, Trigger);

module.exports = TrueTrigger;
