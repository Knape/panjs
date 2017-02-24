// @flow

import defaults from './defaults';
import eventDispatcher from './events';
import { getOffsetPixel, getOffsetProcent, moveEl, getPosition } from './utils';

const setTarget = (el, opts) => (
  el.querySelector(opts.target ? `img${opts.target}` : 'img')
);

const panjs = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let element = null;
  let position = null;
  let image = null;
  let offset = {...defaults.offset, ...options.offset};

  // Base configuration for the pinch instance
  const opts = {...defaults, ...options};
  const { on, dispatch } = eventDispatcher();

  /**
  *  dispatchPinchEvent - Shorthand method for creating events
  *
  *  @param { String } phase
  *  @param { String } type
  *  @param { Object } details
  *  @return { Void }
  **/
  const dispatchPanEvent = (eventName: string, phase: string, off: Object, event: Object = {}): void => {
    dispatch(eventName, Object.assign(event, {
      phase,
      offset: off,
    }));
  };

  const mouseEnter = (e: MouseEvent): void => {
    position = getPosition(e.currentTarget);
    const { width, height } = position();
    // const width = getWidth(e.currentTarget);
    // const height = getHeight(e.currentTarget);
    offset = getOffsetProcent(e, {width, height});
    dispatchPanEvent('mouseenter', 'before', offset, e);
  };

  const calcMove = (e: MouseEvent): void => {
    console.log('----');
    offset = getOffsetProcent(e, position());
    const imagePosition = image.getBoundingClientRect();
    dispatchPanEvent('mousemove', 'before', offset, e);
    moveEl(image, imagePosition, position(), getOffsetPixel(imagePosition, position(), offset), opts);
  };

  const mouseLeave = (e: MouseEvent): void => {
    const { width, height } = position();
    // const width = getWidth(e.currentTarget);
    // const height = getHeight(e.currentTarget);
    offset = getOffsetProcent(e, {width, height});
    dispatchPanEvent('mouseleave', 'before', offset, e);
  };

  const calcMoveResize = (e): void => {
    position = getPosition(element);
    const imagePosition = image.getBoundingClientRect();
    dispatchPanEvent('resize', 'before', offset, e);
    moveEl(image, imagePosition, position(), getOffsetPixel(imagePosition, position(), offset), opts);
  };

  const attachEvents = (el: HTMLElement): void => {
    el.addEventListener('mouseenter', mouseEnter);
    el.addEventListener('mousemove', calcMove);
    el.addEventListener('mouseleave', mouseLeave);
    window.addEventListener('resize', calcMoveResize);
  };

  const detachhEvents = (el: HTMLElement): void => {
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
  const reset = (opt: Object = {}): void => {
    if (!element) return;
    image = setTarget(element, opts);
    const imagePosition = image.getBoundingClientRect();
    if (!image) return;
    const resetOpts = Object.assign({}, opts, opt);
    moveEl(image, imagePosition, position(), getOffsetPixel(imagePosition, position(), resetOpts.offset), resetOpts);
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  const destroy = (opt: Object = {}): void => {
    if (!element) return;
    dispatchPanEvent('destroy', 'before', {}, {});
    reset(opt);
    // remove event listeners
    detachhEvents(element);
    dispatchPanEvent('destroy', 'after', {}, {});
  };

  const getOffset = () => {
    return offset;
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  const setup = (target: string | Object): void => {
    if (element) destroy();
    dispatchPanEvent('init', 'before', {}, {});

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

    if (element && setTarget(element, opts)) {
      position = getPosition(element);
      image = setTarget(element, opts);
      const imagePosition = image.getBoundingClientRect();
      attachEvents(element);
      moveEl(image, imagePosition, position(), getOffsetPixel(imagePosition, position(), offset), opts);
    }

    dispatchPanEvent('init', 'after', {}, {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup,
    reset,
    destroy,
    element,
    getOffset,
    on,
  };
};

export default panjs;
