// @flow

import defaults from './defaults';

const getElement = (type: string = 'width') => (el: EventTarget): number => {
  return (type) ? el.getBoundingClientRect()[type] : el.getBoundingClientRect();
};

const getWidth = getElement('width');
const getHeight = getElement('height');
const getX = getElement('left');
const getY = getElement('top');

const subtract = (el: EventTarget) => (acc: number, val: Function): number => (
  (acc === 0) ? acc + val(el) : acc - val(el)
);

const calcOffset = (e: MouseEvent, type: string, ...rest: Array<Function>) => (
  Math.abs(Math.floor(rest.reduce(subtract(e.currentTarget), 0) - e[type]))
);

const getOffset = (e: MouseEvent): Object => ({
  x: calcOffset(e, 'clientX', getX) / getWidth(e.currentTarget),
  y: calcOffset(e, 'clientY', getY) / getHeight(e.currentTarget),
});

export const sanitizeOffset = (el: HTMLElement, image: HTMLElement, offset: Object): Object => {
  const { width, height } = image.getBoundingClientRect();
  return {
    x: (width - getWidth(el)) * offset.x,
    y: (height - getHeight(el)) * offset.y
  };
};

const moveEl = (el: HTMLElement, coords: Object): void => {
  const { style } = el;

  const offsetX = -coords.x;
  const offsetY = -coords.y;
  const translateProp = `translate(${offsetX}px, ${offsetY}px)`;

  style.transform = `${translateProp}`;
};

const panjs = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let element = null;
  let offset = {};

  // Base configuration for the pinch instance
  const opts = {...defaults, ...options};

  const calcMove = (e: MouseEvent): void => {
    offset = getOffset(e);
    const imageTarget = opts.target ? `img${opts.target}` : 'img';
    const image = e.currentTarget.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(e.currentTarget, image, offset));
  };

  const calcMoveResize = (): void => {
    if (!element || offset) return;
    const imageTarget = opts.target ? `img${opts.target}` : 'img';
    const image = element.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(element, image, offset));
  };

  const attachEvents = (el: HTMLElement): void => {
    el.addEventListener('mousemove', calcMove);
    window.addEventListener('resize', calcMoveResize);
  };

  const detachhEvents = (el: HTMLElement): void => {
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
  const reset = (): void => {
    if (!element) return;
    moveEl(element, {x: 0, y: 0});
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  const destroy = (): void => {
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
  const setup = (target: string | Object): void => {
    if (element) destroy();
    // dispatchPinchEvent('init', 'before', {});

    // resolve target
    // pinchit allows for both a node or a string to be passed
    switch (typeof target) {
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
    return (element) ? attachEvents(element) : undefined;

    // dispatchPinchEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup,
    reset,
    destroy,
    element,
  };
};

export default panjs;
