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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _panjs = __webpack_require__(1);

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getParentElement = function getParentElement() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'width';
  return function (el) {
    var parentRect = el.parentElement;
    return parentRect && type ? parentRect.getBoundingClientRect()[type] : 0;
  };
};

var getParentWidth = getParentElement('width');
var getParentHeight = getParentElement('height');
var getParentX = getParentElement('left');
var getParentY = getParentElement('top');

var subtract = function subtract(el) {
  return function (acc, val) {
    return acc === 0 ? acc + val(el) : acc - val(el);
  };
};

var calcOffset = function calcOffset(e, type) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return Math.abs(Math.floor(rest.reduce(subtract(e.target), 0) - e[type]));
};

var getOffset = function getOffset(e) {
  return {
    x: calcOffset(e, 'clientX', getParentX) / getParentWidth(e.target),
    y: calcOffset(e, 'clientY', getParentY) / getParentHeight(e.target)
  };
};

var sanitizeOffset = exports.sanitizeOffset = function sanitizeOffset(el, offset) {
  return {
    x: (el.getBoundingClientRect().width - getParentWidth(el)) * offset.x,
    y: (el.getBoundingClientRect().height - getParentHeight(el)) * offset.y
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

  var calcMove = function calcMove(e) {
    offset = getOffset(e);
    moveEl(e.target, sanitizeOffset(e.target, offset));
  };

  var calcMoveResize = function calcMoveResize() {
    if (!element || offset) return;
    moveEl(element, sanitizeOffset(element, offset));
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

    // Base configuration for the pinch instance
    // opts = {...defaults, ...opt};

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});