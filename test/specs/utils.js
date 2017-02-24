export const extractTransform = (value: string, match: string): string => {
  const items = value.split(')');
  const foundItem = items.find(item => item.indexOf(match) > -1);
  return (foundItem) ? foundItem + ')' : '';
};

export const mousePoint = (element, startX = 0, startY = 0) => {
  const { width, height, left, top } = element.getBoundingClientRect();
  return (moveX = 0, moveY = 0) => {
    const x = (width * startX) + left;
    const y = (height * startY) + top;
    return {
      clientX: x + moveX,
      clientY: y + moveY
    };
  }
}

export const mouseAnimate = (points, element, itt = 10, time = 10, stepX = 1, stepY = 1, opts = {}) => {
  let index = 0;
  const caller = (point, opts) => {
    mouseEvent('mousemove', element, time, point).then(() => {
      if (index > itt) {
        if (typeof opts.done === 'function') opts.done();
        return
      };
      if (typeof opts.tick === 'function') opts.tick();
      return caller(points(index++), opts)
    })
  }

  return caller(points(index++), opts);
}

export const mouseEvent = (eventType, el, timeout, coords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('Event');
      event.initEvent(eventType, true, true);
      event.clientX = coords.clientX;
      event.clientY = coords.clientY;
      el.dispatchEvent(event);
      resolve({el, event})
    }, timeout);
  });
};

export const extractStyleProp = (style: string) => (
  style
    .slice(style.indexOf('(') + 1, style.lastIndexOf(')'))
    .split(',')
    .map((n) => {
      return !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : 0;
    })
);


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
