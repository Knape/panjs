'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var panjs = function panjs(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var element = null;
  var offset = _extends({}, options.offset);

  // Base configuration for the pinch instance
  var opts = _extends({}, _defaults2.default, options);

  var _eventDispatcher = (0, _events2.default)(),
      on = _eventDispatcher.on,
      dispatch = _eventDispatcher.dispatch;

  /**
  *  dispatchPinchEvent - Shorthand method for creating events
  *
  *  @param { String } phase
  *  @param { String } type
  *  @param { Object } details
  *  @return { Void }
  **/


  var dispatchPanEvent = function dispatchPanEvent(eventName, phase) {
    var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    dispatch(eventName, Object.assign(event, {
      phase: phase
    }));
  };

  var mouseEnter = function mouseEnter(e) {
    dispatchPanEvent('mouseenter', 'before', e);
  };

  var calcMove = function calcMove(e) {
    offset = (0, _utils.getOffset)(e);
    var imageTarget = opts.target ? 'img' + opts.target : 'img';
    var image = e.currentTarget.querySelector(imageTarget);
    if (!image) return;
    (0, _utils.moveEl)(image, (0, _utils.sanitizeOffset)(e.currentTarget, image, offset), opts);
  };

  var mouseLeave = function mouseLeave(e) {
    dispatchPanEvent('mouseleave', 'before', e);
  };

  var calcMoveResize = function calcMoveResize() {
    if (!element || !Object.hasOwnProperty.call(offset, 'x')) return;
    var imageTarget = opts.target ? 'img' + opts.target : 'img';
    var image = element.querySelector(imageTarget);
    if (!image) return;
    (0, _utils.moveEl)(image, (0, _utils.sanitizeOffset)(element, image, offset), opts);
  };

  var attachEvents = function attachEvents(el) {
    el.addEventListener('mouseenter', mouseEnter);
    el.addEventListener('mousemove', calcMove);
    el.addEventListener('mouseleave', mouseLeave);
    window.addEventListener('resize', calcMoveResize);
  };

  var detachhEvents = function detachhEvents(el) {
    el.removeEventListener('mouseenter', mouseEnter);
    el.removeEventListener('mousemove', calcMove);
    el.removeEventListener('mouseleave', mouseLeave);
    window.removeEventListener('resize', calcMoveResize);
  };

  /**
   * public
   * reset function:
   * @param { Number } duration
   * @param { String } easing
   * @return { Void }
   */
  var reset = function reset() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!element) return;
    var imageTarget = opts.target ? 'img' + opts.target : 'img';
    var image = element.querySelector(imageTarget);
    if (!image) return;
    (0, _utils.moveEl)(image, Object.assign(opts.offset, opt.offset), opts);
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  var destroy = function destroy() {
    if (!element) return;
    dispatchPanEvent('destroy', 'before', {});
    reset();
    // remove event listeners
    detachhEvents(element);
    dispatchPanEvent('destroy', 'after', {});
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  var setup = function setup(target) {
    if (element) destroy();
    dispatchPanEvent('init', 'before', {});

    // resolve target
    // pinchit allows for both a node or a string to be passed
    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      case 'object':
        element = target;
        break;
      case 'string':
        element = document.querySelector(target);
        break;
      default:
        element = null;
        console.warn('missing target, either pass an node or a string');
    }

    if (element) {
      attachEvents(element);
      (0, _utils.moveEl)(element.querySelector('img'), offset);
    }

    dispatchPanEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup: setup,
    reset: reset,
    destroy: destroy,
    element: element,
    on: on
  };
};

exports.default = panjs;