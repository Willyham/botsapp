'use strict';

function TextTrigger(text) {
  this.text = text;
}

TextTrigger.prototype.matches = function matches(event) {
  return event.body.indexOf(this.text) !== -1;
};

module.exports = TextTrigger;
