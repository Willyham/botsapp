'use strict';

var util = require('util');

var Dispatcher = require('./dispatcher');

function DrainDispatcher(date) {
  Dispatcher.call(this);
  this.drained = false;
  this.dispatchAfter = date || Date.now();
}

util.inherits(DrainDispatcher, Dispatcher);

/**
 * Drop all old messages up until we instantiated this disptacher
 * Dispatch anything that comes afterwards
 * @param {Object} event The event
 */
Dispatcher.prototype.dispatchEvent = function dispatchEvent(event) {
  var self = this;
  if (!this.drained) {
    var eventDate = new Date(event.date);
    if (eventDate >= this.dispatchAfter) {
      this.drained = true;
      dispatch();
    }
    return;
  }
  dispatch();

  function dispatch() {
    var matchingActions = self.triggers.filter(function findMatch(pair) {
      var trigger = pair.trigger;
      return Boolean(trigger.matches(event));
    });

    matchingActions.forEach(function callAction(pair) {
      var action = pair.action;
      if (pair.context) {
        action.call(pair.context, event);
        return;
      }
      action(event);
    });
  }

};

module.exports = DrainDispatcher;
