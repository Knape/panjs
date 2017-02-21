/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';

let element;
const coordSequence = [
  { clientX: 0, clientY: 10},
  { clientX: 10, clientY: 20},
  { clientX: 20, clientY: 30},
  { clientX: 40, clientY: 30}
];

const mouseEvent = (eventType, el, timeout, coords) => {
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
describe('mouse panjs events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('panjs', () => {
    describe('onMouseMove', () => {
      it('panjs should set style to element', (done) => {
        const node = element.querySelector('.img-wrapper');
        const pan = panjs(node);
        mouseEvent('mouseenter', node, 0, coordSequence[0])
        .then(() => {
          const hasTransform = !!node.childNodes[1].style.transform;
          expect(hasTransform).to.eql(true);
          return mouseEvent('mousemove', node, 100, coordSequence[1]);
        })
        .then(() => mouseEvent('mousemove', node, 200, coordSequence[2]))
        .then(() => mouseEvent('mouseleave', node, 0, coordSequence[2]))
        .then(() => {
          const transform = node.childNodes[1].style.transform;
          expect(!!transform).to.eql(true);
          const { x, y } = pan.getOffset();
          const hasX = transform.indexOf(x * 100) > 0
          const hasY = transform.indexOf(y * 100) > 0
          expect(hasX).to.eql(true);
          expect(hasY).to.eql(true);
          done();
        });
      });

      it('panjs should fire events', () => {

      });
    });
  });
});
