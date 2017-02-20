// @flow

import defaults from './defaults';
import eventDispatcher from './events';
import { sanitizeOffset, getOffset, moveEl } from './utils';

const panjs = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let element = null;
  let offset = {};

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
  const dispatchPanEvent = (eventName: string, phase: string, event: Object = {}): void => {
    dispatch(eventName, Object.assign(event, {
      phase
    }));
  };

  const mouseEnter = (e: MouseEvent): void => {
    dispatchPanEvent('mouseenter', 'before', e);
  };

  const calcMove = (e: MouseEvent): void => {
    offset = getOffset(e);
    const imageTarget = opts.target ? `img${opts.target}` : 'img';
    const image = e.currentTarget.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(e.currentTarget, image, offset));
  };

  const mouseLeave = (e: MouseEvent): void => {
    dispatchPanEvent('mouseleave', 'before', e);
  };

  const calcMoveResize = (): void => {
    if (!element || !Object.hasOwnProperty.call(offset, 'x')) return;
    const imageTarget = opts.target ? `img${opts.target}` : 'img';
    const image = element.querySelector(imageTarget);
    if (!image) return;
    moveEl(image, sanitizeOffset(element, image, offset));
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
    dispatchPanEvent('destroy', 'before', {});
    reset();
    // remove event listeners
    detachhEvents(element);
    dispatchPanEvent('destroy', 'after', {});
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  const setup = (target: string | Object): void => {
    if (element) destroy();
    dispatchPanEvent('init', 'before', {});

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

    if (element) {
      attachEvents(element);
    }

    dispatchPanEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup,
    reset,
    destroy,
    element,
    on,
  };
};

export default panjs;
