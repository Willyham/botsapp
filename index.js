'use strict';

var Bot = require('./bot');

var TextTrigger = require('./triggers/TextTrigger');

module.exports = {
  Bot: Bot,
  Triggers: {
    TextTrigger: TextTrigger
  }
};
