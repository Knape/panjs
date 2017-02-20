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

export const getOffset = (e: MouseEvent): Object => ({
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

export const moveEl = (el: HTMLElement, coords: Object): void => {
  const { style } = el;

  const offsetX = -coords.x;
  const offsetY = -coords.y;
  const translateProp = `translate(${offsetX}px, ${offsetY}px)`;

  style.transform = `${translateProp}`;
};
