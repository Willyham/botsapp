'use strict';

var Errors = require('../lib/errors');

/**
 * Create a trigger for a given matching predicate
 * @param {Function} matcher A predicate which indicates whether or not this trigger matches the event
 * @constructor
 */
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

/**
 * Check whether the trigger matches this event by invoking the predecate
 * @param {Object} event Event from whatsapp
 * @returns {Boolean} true if match, false otherwise
 */
Trigger.prototype.matches = function matches(event) {
  return Boolean(this.matcher(event));
};

module.exports = Trigger;
