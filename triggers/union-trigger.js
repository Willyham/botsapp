'use strict';

var util = require('util');

var _ = require('lodash');

var Trigger = require('./trigger');

/**
 * Create a trigger which is a union of multiple triggers
 * @param {Trigger[]} triggers options
 * @constructor
 */
function UnionTrigger(triggers) {
  var matcher = function matcher(event) {
    return _.all(triggers, function(trigger) {
      return trigger.matches(event);
    });
  };
  Trigger.call(this, matcher);
}

util.inherits(UnionTrigger, Trigger);

module.exports = UnionTrigger;
