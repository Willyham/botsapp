'use strict';

var Bot = require('./bot');

var TextTrigger = require('./triggers/MessageTrigger');

module.exports = {
  Bot: Bot,
  Triggers: {
    TextTrigger: TextTrigger
  }
};
