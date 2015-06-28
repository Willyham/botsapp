'use strict';

var Bot = require('./bot');

var TextTrigger = require('./triggers/text-trigger');
var TrueTrigger = require('./triggers/true-trigger');
var GroupTrigger = require('./triggers/group-trigger');
var UnionTrigger = require('./triggers/union-trigger');

module.exports = {
  Bot: Bot,
  Triggers: {
    TextTrigger: TextTrigger,
    GroupTrigger: GroupTrigger,
    TrueTrigger: TrueTrigger,
    UnionTrigger: UnionTrigger
  }
};
