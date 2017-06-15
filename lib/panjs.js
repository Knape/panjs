'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setTarget = function setTarget(el, opts) {
  return el.querySelector(opts.target ? 'img' + opts.target : 'img');
};

var panjs = function panjs(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var element = null;
  var position = null;
  var image = null;
  var offset = options.offset || _defaults2.default.offset;

  // Base configuration for the pinch instance
  var opts = Object.assign({}, _defaults2.default, options);

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


  var dispatchPanEvent = function dispatchPanEvent(eventName, phase, off, event) {
    dispatch(eventName, Object.assign(event, {
      phase: phase,
      offset: off
    }));
  };

  var mouseEnter = function mouseEnter(e) {
    position = (0, _utils.getPosition)(e.currentTarget);

    var _position = position(),
        width = _position.width,
        height = _position.height;

    offset = (0, _utils.getOffsetProcent)(e, { width: width, height: height });
    dispatchPanEvent('mouseenter', 'before', offset, e);
  };

  var calcMove = function calcMove(e) {
    if (!image || !position) return;
    offset = (0, _utils.getOffsetProcent)(e, position());
    var imagePosition = image.getBoundingClientRect();
    dispatchPanEvent('mousemove', 'before', offset, e);
    var calledPosition = position();
    (0, _utils.moveEl)(image, (0, _utils.getOffsetPixel)(imagePosition, calledPosition, offset), opts);
  };

  var mouseLeave = function mouseLeave(e) {
    if (!position) return;

    var _position2 = position(),
        width = _position2.width,
        height = _position2.height;

    offset = (0, _utils.getOffsetProcent)(e, { width: width, height: height });
    dispatchPanEvent('mouseleave', 'before', offset, e);
  };

  var calcMoveResize = function calcMoveResize(e) {
    if (!image) return;
    position = (0, _utils.getPosition)(element);
    var imagePosition = image.getBoundingClientRect();
    dispatchPanEvent('resize', 'before', offset, e);
    (0, _utils.moveEl)(image, (0, _utils.getOffsetPixel)(imagePosition, position(), offset), opts);
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

    if (!element || !position) return;
    image = setTarget(element, opts);
    if (!image) return;
    var imagePosition = image.getBoundingClientRect();
    var resetOpts = Object.assign({}, opts, opt);
    var calledPosition = position();
    (0, _utils.moveEl)(image, (0, _utils.getOffsetPixel)(imagePosition, calledPosition, resetOpts.offset), resetOpts);
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  var destroy = function destroy() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!element || !image) return;
    dispatchPanEvent('destroy', 'before', {}, {});
    reset(opt);
    // remove event listeners
    detachhEvents(element);
    dispatchPanEvent('destroy', 'after', {}, {});
  };

  var getOffset = function getOffset() {
    return offset;
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  var setup = function setup(target) {
    if (element) destroy();
    dispatchPanEvent('init', 'before', {}, {});

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
      image = setTarget(element, opts);
      if (!image) return;
      position = (0, _utils.getPosition)(element);
      var imagePosition = image.getBoundingClientRect();
      attachEvents(element);
      (0, _utils.moveEl)(image, (0, _utils.getOffsetPixel)(imagePosition, position(), offset), opts);
    }

    dispatchPanEvent('init', 'after', {}, {});
  };

  // trigger initial setup
  setup(targets);

  return {
    setup: setup,
    reset: reset,
    destroy: destroy,
    element: element,
    getOffset: getOffset,
    on: on
  };
};

exports.default = panjs;