(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("panjs", [], factory);
	else if(typeof exports === 'object')
		exports["panjs"] = factory();
	else
		root["panjs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _panjs = __webpack_require__(3);

var _panjs2 = _interopRequireDefault(_panjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _panjs2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * dispatch custom events
 */

var eventDispatcher = function eventDispatcher() {
  var events = {};

  /**
   * Register a handler for event, to be fired
   * for every event.
   */
  var on = function on(eventName, handler) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(handler);
    return undefined;
  };

  /**
   * dispatch an event for a handler.
   */

  var dispatch = function dispatch(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  };

  return {
    on: on,
    dispatch: dispatch
  };
};

exports.default = eventDispatcher;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _defaults = __webpack_require__(1);

var _defaults2 = _interopRequireDefault(_defaults);

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _utils = __webpack_require__(4);

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var extractTransform = function extractTransform(value, match) {
  var items = value.split(')');
  var foundItem = items.find(function (item) {
    return item.indexOf(match) > -1;
  });
  return foundItem ? foundItem + ')' : '';
};

var extractStyleProp = function extractStyleProp(style) {
  return style.slice(style.indexOf('(') + 1, style.lastIndexOf(')')).split(',').map(function (n) {
    return !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : 0;
  });
};

var getPosition = exports.getPosition = function getPosition(el) {
  var rect = el && typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };
  return function (type) {
    return type ? rect[type] : rect;
  };
};

var calcOffset = function calcOffset(e, type, position) {
  return Math.abs(position - e[type]);
};

var handleAnimation = function handleAnimation(el, duration, ease) {
  var style = el.style;

  style.transformOrigin = '0% 0%';
  style.transitionTimingFunction = ease;
  style.transitionDuration = duration + 'ms';
};

var getOffsetProcent = exports.getOffsetProcent = function getOffsetProcent(e, boundingRect) {
  var width = boundingRect.width,
      height = boundingRect.height,
      top = boundingRect.top,
      left = boundingRect.left;

  return {
    x: calcOffset(e, 'clientX', left) / width,
    y: calcOffset(e, 'clientY', top) / height
  };
};

var getOffsetPixel = exports.getOffsetPixel = function getOffsetPixel(image, parentPosition, offset) {
  return {
    x: (image.width - parentPosition.width) * offset.x,
    y: (image.height - parentPosition.height) * offset.y
  };
};

var moveEl = exports.moveEl = function moveEl(el, coords) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var style = el.style;


  var translate = extractTransform(style.transform, 'translate');
  var preOffset = extractStyleProp(translate);

  var offsetX = opts.xAxisLock ? Math.abs(preOffset[0] || 0) : Math.abs(coords.x);
  var offsetY = opts.yAxisLock ? Math.abs(preOffset[1] || 0) : Math.abs(coords.y);

  var translateProp = 'translate(' + -offsetX + 'px, ' + -offsetY + 'px)';
  handleAnimation(el, opts.speed, opts.ease);
  style.transform = '' + translateProp;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});