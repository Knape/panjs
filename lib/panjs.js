'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeOffset = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getElement = function getElement() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'width';
  return function (el) {
    return type ? el.getBoundingClientRect()[type] : el.getBoundingClientRect();
  };
};

var getWidth = getElement('width');
var getHeight = getElement('height');
var getX = getElement('left');
var getY = getElement('top');

var subtract = function subtract(el) {
  return function (acc, val) {
    return acc === 0 ? acc + val(el) : acc - val(el);
  };
};

var calcOffset = function calcOffset(e, type) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return Math.abs(Math.floor(rest.reduce(subtract(e.currentTarget), 0) - e[type]));
};

var getOffset = function getOffset(e) {
  return {
    x: calcOffset(e, 'clientX', getX) / getWidth(e.currentTarget),
    y: calcOffset(e, 'clientY', getY) / getHeight(e.currentTarget)
  };
};

var sanitizeOffset = exports.sanitizeOffset = function sanitizeOffset(el, image, offset) {
  var _image$getBoundingCli = image.getBoundingClientRect(),
      width = _image$getBoundingCli.width,
      height = _image$getBoundingCli.height;

  return {
    x: (width - getWidth(el)) * offset.x,
    y: (height - getHeight(el)) * offset.y
  };
};

var moveEl = function moveEl(el, coords) {
  var style = el.style;


  var offsetX = -coords.x;
  var offsetY = -coords.y;
  var translateProp = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';

  style.transform = '' + translateProp;
};

var panjs = function panjs(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var element = null;
  var offset = {};

  // Base configuration for the pinch instance
  var opts = _extends({}, _defaults2.default, options);

  var calcMove = function calcMove(e) {
    offset = getOffset(e);
    var imageTarget = opts.target ? 'img' + opts.target : 'img';
    var image = e.currentTarget.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(e.currentTarget, image, offset));
  };

  var calcMoveResize = function calcMoveResize() {
    if (!element || offset) return;
    var imageTarget = opts.target ? 'img' + opts.target : 'img';
    var image = element.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(element, image, offset));
  };

  var attachEvents = function attachEvents(el) {
    el.addEventListener('mousemove', calcMove);
    window.addEventListener('resize', calcMoveResize);
  };

  var detachhEvents = function detachhEvents(el) {
    el.removeEventListener('touchstart', calcMove);
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
    if (!element) return;
    moveEl(element, { x: 0, y: 0 });
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  var destroy = function destroy() {
    if (!element) return;
    // dispatchPinchEvent('destroy', 'before', {});
    reset();
    // remove event listeners
    detachhEvents(element);
    // dispatchPinchEvent('destroy', 'after', {});
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  var setup = function setup(target) {
    if (element) destroy();
    // dispatchPinchEvent('init', 'before', {});

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
    return element ? attachEvents(element) : undefined;

    // dispatchPinchEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup: setup,
    reset: reset,
    destroy: destroy,
    element: element
  };
};

exports.default = panjs;