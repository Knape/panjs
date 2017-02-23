// @flow

const extractTransform = (value: string, match: string): string => {
  const items = value.split(')');
  const foundItem = items.find(item => item.indexOf(match) > -1);
  return (foundItem) ? foundItem + ')' : '';
};

const extractStyleProp = (style: string) => (
  style
    .slice(style.indexOf('(') + 1, style.lastIndexOf(')'))
    .split(',')
    .map((n) => {
      return !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : 0;
    })
);

const getElement = (type: string) => (el: EventTarget): number => {
  return el.getBoundingClientRect()[type];
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

const handleAnimation = (el: EventTarget, transition: string, duration: number, ease: string): void => {
  const { style } = el;
  style.transformOrigin = '0% 0%';
  style[`${transition}TimingFunction`] = ease;
  style[`${transition}Duration`] = `${duration}ms`;
};

export const getOffsetProcent = (e: MouseEvent): Object => ({
  x: calcOffset(e, 'clientX', getX) / getWidth(e.currentTarget),
  y: calcOffset(e, 'clientY', getY) / getHeight(e.currentTarget),
});

export const getOffsetPixel = (el: EventTarget, image: HTMLElement, offset: Object): Object => {
  const { width, height } = image.getBoundingClientRect();
  return {
    x: (width - getWidth(el)) * offset.x,
    y: (height - getHeight(el)) * offset.y
  };
};

export const moveEl = (el: HTMLElement, wrapper: HTMLElement, coords: Object, opts: Object = {}): void => {
  const { style } = el;

  const translate = extractTransform(style.transform, 'translate');
  const preOffset = extractStyleProp(translate);

  const offsetX = opts.xAxisLock ? -Math.abs(preOffset[0] || 0) : -Math.abs(coords.x);
  const offsetY = opts.yAxisLock ? -Math.abs(preOffset[1] || 0) : -Math.abs(coords.y);

  // const currentPosition = wrapper.getBoundingClientRect().left - el.getBoundingClientRect().left;
  const translateProp = `translate(${offsetX}px, ${offsetY}px)`;
  handleAnimation(el, 'transition', opts.speed, opts.ease);
  style.transform = `${translateProp}`;
};
