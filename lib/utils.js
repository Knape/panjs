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

var getOffsetProcent = exports.getOffsetProcent = function getOffsetProcent(e) {
  return {
    x: calcOffset(e, 'clientX', getX) / getWidth(e.currentTarget),
    y: calcOffset(e, 'clientY', getY) / getHeight(e.currentTarget)
  };
};

var getOffsetPixel = exports.getOffsetPixel = function getOffsetPixel(el, image, offset) {
  var _image$getBoundingCli = image.getBoundingClientRect(),
      width = _image$getBoundingCli.width,
      height = _image$getBoundingCli.height;

  return {
    x: (width - getWidth(el)) * offset.x,
    y: (height - getHeight(el)) * offset.y
  };
};

var moveEl = exports.moveEl = function moveEl(el, coords) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var style = el.style;

  var translate = extractTransform(style.transform, 'translate');
  var preOffset = extractStyleProp(translate);
  var offsetX = opts.xAxisLock ? -Math.abs(preOffset[0] || 0) : -Math.abs(coords.x);
  var offsetY = opts.yAxisLock ? -Math.abs(preOffset[1] || 0) : -Math.abs(coords.y);
  var translateProp = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
  style.transform = '' + translateProp;
};