'use strict';

var _ = require('lodash');
var haversine = require('haversine');

module.exports = {

  /**
   * Check that the event has a location
   * @returns {Function} predicate
   */
  isLocation: function() {
    return function(event) {
      return _.isNumber(event.latitude) && _.isNumber(event.longitude);
    }
  },

  /**
   * Use haversine distance to check if location is within a limit
   * @param {{latitude: number, longitude: number}} point Point to check
   * @param {Number} distanceLimit limit
   * @param {String} [unit] distance unit, 'km' (default) or 'mile'
   * @returns {Function} predicate
   */
  withinDistance: function(point, distanceLimit, unit) {
    unit = unit || 'km';
    return function(event) {
      if (!event.latitude) {
        return false;
      }
      var sentLocation = _.pick(event, 'latitude', 'longitude');
      var distance = haversine(point, sentLocation, unit);
      return distance <= distanceLimit;
    }
  }

};
