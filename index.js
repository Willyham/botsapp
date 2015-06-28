'use strict';

var Bot = require('./bot');

var TextTrigger = require('./triggers/text-trigger');
var TrueTrigger = require('./triggers/true-trigger');

module.exports = {
  Bot: Bot,
  Triggers: {
    TextTrigger: TextTrigger,
    TrueTrigger: TrueTrigger
  }
};
