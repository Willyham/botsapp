'use strict';

var util = require('util');
var Trigger = require('./trigger');

function TextTrigger(text) {
  var self = this;
  this.text = text;
  var matcher = function matcher(event) {
    return event.body.indexOf(self.text) !== -1;
  };
  Trigger.call(this, matcher);
}

util.inherits(TextTrigger, Trigger);

module.exports = TextTrigger;
