// @flow

const getParentElement = (type: string = 'width') => (el: EventTarget): number => {
  const parentRect = el.parentElement;
  return (parentRect && type) ? parentRect.getBoundingClientRect()[type] : 0;
};

const getParentWidth = getParentElement('width');
const getParentHeight = getParentElement('height');
const getParentX = getParentElement('left');
const getParentY = getParentElement('top');

const subtract = (el: EventTarget) => (acc: number, val: Function): number => (
  (acc === 0) ? acc + val(el) : acc - val(el)
);

const calcOffset = (e: MouseEvent, type: string, ...rest: Array<Function>) => (
  Math.abs(Math.floor(rest.reduce(subtract(e.target), 0) - e[type]))
);

const getOffset = (e: MouseEvent): Object => ({
  x: calcOffset(e, 'clientX', getParentX) / getParentWidth(e.target),
  y: calcOffset(e, 'clientY', getParentY) / getParentHeight(e.target),
});

export const sanitizeOffset = (el: HTMLElement, offset: Object): Object => {
  return {
    x: (el.getBoundingClientRect().width - getParentWidth(el)) * offset.x,
    y: (el.getBoundingClientRect().height - getParentHeight(el)) * offset.y
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

  const calcMove = (e) => {
    offset = getOffset(e);
    moveEl(e.target, sanitizeOffset(e.target, offset));
  };

  const calcMoveResize = (): void => {
    if (!element || offset) return;
    moveEl(element, sanitizeOffset(element, offset));
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

    // Base configuration for the pinch instance
    // opts = {...defaults, ...opt};

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
