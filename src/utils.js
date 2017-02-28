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

export const getPosition = (el) => {
  const rect = el.getBoundingClientRect();
  return (type) => {
    return (type) ? rect[type] : rect;
  };
};

const calcOffset = (e: MouseEvent, type: string, position) => (
  Math.abs(position - e[type])
);

const handleAnimation = (el: EventTarget, transition: string, duration: number, ease: string): void => {
  const { style } = el;
  style.transformOrigin = '0% 0%';
  style[`${transition}TimingFunction`] = ease;
  style[`${transition}Duration`] = `${duration}ms`;
};

export const getOffsetProcent = (e: MouseEvent, { width, height, top, left }): Object => {
  return {
    x: calcOffset(e, 'clientX', left) / width,
    y: calcOffset(e, 'clientY', top) / height,
  };
};

export const getOffsetPixel = (image: HTMLElement, parentPosition, offset: Object): Object => {
  return {
    x: (image.width - parentPosition.width) * offset.x,
    y: (image.height - parentPosition.height) * offset.y
  };
};

export const moveEl = (el: HTMLElement, imagePosition, wrapperPosition, coords: Object, opts: Object = {}): void => {
  const { style } = el;

  const translate = extractTransform(style.transform, 'translate');
  const preOffset = extractStyleProp(translate);

  const offsetX = opts.xAxisLock ? Math.abs(preOffset[0] || 0) : Math.abs(coords.x);
  const offsetY = opts.yAxisLock ? Math.abs(preOffset[1] || 0) : Math.abs(coords.y);

  const translateProp = `translate(${-offsetX}px, ${-offsetY}px)`;
  handleAnimation(el, 'transition', opts.speed, opts.ease);
  style.transform = `${translateProp}`;
};
