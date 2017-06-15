'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  /**
   * default taget class for image
   * @target {String}
   */
  target: null,

  /**
   * default offset
   * @offset {Object}
   */
  offset: { x: 0, y: 0 },

  /**
   * overwrite to lock x-axis paning
   * @xAxisLock {Boolean}
   */
  xAxisLock: false,

  /**
   * overwrite to lock y-axis paning
   * @yAxisLock {Boolean}
   */
  yAxisLock: false,

  /**
   * Default animation speed
   * @speed {Number}
   */
  speed: 0,

  /**
   * Default easing
   * @speed {string}
   */
  ease: 'ease'
};