'use strict';

var Buffer = require('buffer').Buffer;

var _ = require('lodash');
var extend = require('xtend');

var Errors = require('./lib/errors');

var Location = require('./predicates/location');
var Message = require('./predicates/message');

var JOIN_MODES = {
  ALL: 'all',
  ANY: 'any'
};

/**
 * Create a trigger for a given matching predicate
 * @param {Object} options
 * @constructor
 */
function Trigger(options) {
  options = options || {};
  this.options = extend({
    mode: JOIN_MODES.ALL
  }, options);

  if (!_.contains(_.values(JOIN_MODES), this.options.mode)) {
    throw Errors.InvalidArgumentError({
      argument: 'options.mode',
      given: options.mode,
      expected: 'One of: ' + _.values(JOIN_MODES)
    });
  }
  this.conditions = [];
}

/**
 * Check whether the trigger matches this event by invoking the predecate
 * @param {Object} event Event from whatsapp
 * @returns {Boolean} true if match, false otherwise
 */
Trigger.prototype.matches = function matches(event) {
  function isMatch(predicate) {
    return predicate(event);
  }
  if (this.options.mode === JOIN_MODES.ALL) {
    return _.all(this.conditions, isMatch);
  }
  return _.any(this.conditions, isMatch);
};

// Predicate constructors below

/**
 * Create a trigger which always matches an event
 * Useful if you want to capture everything
 */
Trigger.prototype.always = function always() {
  var predicate = function matcher() {
    return true;
  };
  this.conditions.push(predicate);
  return this;
};

/**
 * Create a trigger which matches some text
 * @param {String} text Text to match
 * @param {Object} options options
 * @param {Boolean} [options.caseSensitive=false] Match case sensitive, default false
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.withText = function matchingText(text, options) {
  this.conditions.push(Message.withText(text, options));
  return this;
};

/**
 * Create a trigger which matches a regex
 * @param {RegExp} regex Regex to apply to message
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.withRegex = function withRegex(regex) {
  if (!(regex instanceof RegExp)) {
    throw Errors.InvalidArgumentError({
      argument: 'regex',
      given: regex,
      expected: 'RegExp'
    });
  }
  this.conditions.push(Message.withRegex(regex));
  return this;
};

/**
 * Create a trigger which matches emoji
 * @param {Buffer} emoji Emoji as a buffer
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.withEmoji = function containingEmoji(emoji) {
  if (!Buffer.isBuffer(emoji)) {
    throw Errors.InvalidArgumentError({
      argument: 'emoji',
      given: emoji,
      expected: 'buffer'
    });
  }
  this.conditions.push(Message.withEmoji(emoji));
  return this;
};

/**
 * Create a trigger which matches some author
 * @param {String} author the author
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.from = function from(author) {
  var predicate = function matcher(event) {
    if (event.author) {
      return event.author === author;
    }
    return event.from === author;
  };
  this.conditions.push(predicate);
  return this;
};

/**
 * Create a trigger which matches a group
 * @param {Object} options options
 * @param {String} [options.groupId] options
 * @param {String} [options.author] options
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.inGroup = function inGroup(options) {
  options = options || {};

  var predicate = function matcher(event) {
    if (!event.isGroup) {
      return false;
    }
    if (options.groupId && options.groupId !== event.from) {
      return false;
    }
    if (options.author && options.author !== event.author) {
      return false;
    }
    return true;
  };
  this.conditions.push(predicate);
  return this;
};

/**
 * Register a custom predicate
 * @param {Function} predicate the predicate
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.custom = function custom(predicate) {
  this.conditions.push(predicate);
  return this;
};

/**
 * Check that a message is a location
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.isLocation = function isLocation() {
  this.conditions.push(Location.isLocation);
  return this;
};

/**
 * Check that a location message is within a distance of
 * @param {{latitude: number, longitude: number}} point Point to check
 * @param {Number} distanceLimit limit
 * @param {String} [unit] distance unit, 'km' (default) or 'mile'
 * @returns {Trigger} this object for chaining
 */
Trigger.prototype.withinDistanceOf = function withinDistanceOf(point, distanceLimit, unit) {
  this.conditions.push(Location.withinDistance(point, distanceLimit, unit));
  return this;
};

module.exports = Trigger;
