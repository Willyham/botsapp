'use strict';

var WORDS_PER_SECOND = 0.7;

/**
 * Get an artificial delay based on length of the text.
 * @param {String} text The text to send
 * @returns {Number} A delay
 */
module.exports = function getTypeDelay(text) {
  var words = text.split(' ');
  return (words.length * WORDS_PER_SECOND * 1000) + getNoise(3);
};

/**
 * Get +- N seconds of noise, randomly
 * @param {Number} seconds number of seconds
 * @returns {Number} some noise, in ms
 */
function getNoise(seconds) {
  var noise = Math.random() * seconds * 1000;
  if (noise % 2 === 0) {
    return noise;
  }
  return -noise;
}
