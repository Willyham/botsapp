'use strict';

var Errors = require('./errors');

function Trigger(matcher) {
  if (!matcher || typeof matcher !== 'function') {
    throw Errors.InvalidArgumentError({
      argument: 'matcher',
      given: typeof matcher,
      expected: 'Function'
    });
  }
  this.matcher = matcher;
}

Trigger.prototype.matches = function matches(event) {
  return Boolean(this.matcher(event));
};

module.exports = Trigger;
