'use strict';

var Buffer = require('buffer').Buffer;

var _ = require('lodash');
var extend = require('xtend');
var Buffertools = require('buffertools');

var Errors = require('./lib/errors');

var Location = require('./predicates/location');

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
 * Create a trigger which always matches an event
 * Useful if you want to capture everything
 * @constructor
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
 * @constructor
 */
Trigger.prototype.withText = function matchingText(text, options) {
  options = options || {};
  options = extend({
    caseSensitive: false
  }, options);

  var predicate = function matcher(event) {
    if (!event.body) {
      return false;
    }
    if (!options.caseSensitive) {
      return event.body.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    }
    return event.body.indexOf(text) !== -1;
  };
  this.conditions.push(predicate);
  return this;
};

Trigger.prototype.withRegex = function withRegex(regex) {
  if (!(regex instanceof RegExp)) {
    throw Errors.InvalidArgumentError({
      argument: 'regex',
      given: regex,
      expected: 'RegExp'
    });
  }
  var predicate = function matcher(event) {
    if (!event.body) {
      return false;
    }
    return regex.test(event.body);
  };
  this.conditions.push(predicate);
  return this;
};

Trigger.prototype.withEmoji = function containingEmoji(emoji) {
  if (!Buffer.isBuffer(emoji)) {
    throw Errors.InvalidArgumentError({
      argument: 'emoji',
      given: emoji,
      expected: 'buffer'
    });
  }
  var predicate = function matcher(event) {
    if (!event.body) {
      return false;
    }
    var bodyBuffer = new Buffer(event.body);
    return Boolean(Buffertools.indexOf(bodyBuffer, emoji) !== -1);
  };
  this.conditions.push(predicate);
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

Trigger.prototype.isLocation = function isLocation() {
  this.conditions.push(Location.isLocation);
  return this;
};

Trigger.prototype.withinDistanceOf = function withinDistanceOf(point, distance) {
  this.conditions.push(Location.withinDistance(point, distance));
  return this;
};

module.exports = Trigger;
