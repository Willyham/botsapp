'use strict';

var Errors = require('./errors');

function Dispatcher() {
  this.triggerActionPairs = [];
}

Dispatcher.prototype.registerAction = function registerAction(trigger, action, context) {
  if (!trigger) {
    throw Errors.InvalidArgumentError({
      argument: 'trigger',
      given: typeof trigger,
      expected: 'Trigger'
    });
  }

  if (!action || typeof action !== 'function') {
    throw Errors.InvalidArgumentError({
      argument: 'action',
      given: typeof action,
      expected: 'Function'
    });
  }
  this.triggerActionPairs.push({
    trigger: trigger,
    action: action,
    context: context
  });
};

Dispatcher.prototype.dispatchEvent = function dispatchEvent(event) {
  var matchingActions = this.triggerActionPairs.filter(function findMatch(pair) {
    var trigger = pair.trigger;
    return Boolean(trigger.matches(event));
  });

  matchingActions.forEach(function dispatch(pair) {
    var action = pair.action;
    if (pair.context) {
      action.call(pair.context, event);
      return;
    }
    action(event);
  });
};

module.exports = Dispatcher;
