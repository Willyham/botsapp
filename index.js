'use strict';

var Bot = require('./bot');

var TextTrigger = require('./triggers/TextTrigger');
var TrueTrigger = require('./triggers/TrueTrigger');

module.exports = {
  Bot: Bot,
  Triggers: {
    TextTrigger: TextTrigger,
    TrueTrigger: TrueTrigger
  }
};
