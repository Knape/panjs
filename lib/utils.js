'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var getOffset = exports.getOffset = function getOffset(e) {
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

var moveEl = exports.moveEl = function moveEl(el, coords) {
  var style = el.style;


  var offsetX = -coords.x;
  var offsetY = -coords.y;
  var translateProp = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';

  style.transform = '' + translateProp;
};