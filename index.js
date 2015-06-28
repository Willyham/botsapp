'use strict';

var Bot = require('./bot');
var Trigger = require('./trigger');
var Dispatcher = require('./lib/dispatcher');
var DrainDispatcher = require('./lib/drain-dispatcher');

module.exports = {
  Bot: Bot,
  Trigger: Trigger,
  Dispatcher: Dispatcher,
  DrainDispatcher: DrainDispatcher
};
