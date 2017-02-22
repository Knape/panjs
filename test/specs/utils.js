export const extractTransform = (value: string, match: string): string => {
  const items = value.split(')');
  const foundItem = items.find(item => item.indexOf(match) > -1);
  return (foundItem) ? foundItem + ')' : '';
};

export const extractStyleProp = (style: string) => (
  style
    .slice(style.indexOf('(') + 1, style.lastIndexOf(')'))
    .split(',')
    .map((n) => {
      return !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : 0;
    })
);

export const mouseEvent = (eventType, el, timeout, coords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('Event');
      event.initEvent(eventType, true, true);
      event.clientX = coords.clientX;
      event.clientY = coords.clientY;
      el.dispatchEvent(event);
      resolve({el, event});
    }, timeout);
  });
};

export const resizeEvent = (el, timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      el.dispatchEvent(event);
      resolve({el, event});
    }, timeout);
  });
};
