'use strict';

var Errors = require('./errors');

function Trigger(action) {

}

Trigger.prototype.matches = function matches() {
  return false;
};

module.exports = Trigger;
