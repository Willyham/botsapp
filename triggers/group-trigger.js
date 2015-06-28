'use strict';

var util = require('util');

var Trigger = require('./trigger');

/**
 * Create a trigger which matches a group
 * @param {Object} options options
 * @param {String} [options.groupId] options
 * @param {String} [options.author] options
 * @constructor
 */
function GroupTrigger(options) {
  options = options || {};
  var matcher = function matcher(event) {
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
  Trigger.call(this, matcher);
}

util.inherits(GroupTrigger, Trigger);

module.exports = GroupTrigger;
