'use strict';

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