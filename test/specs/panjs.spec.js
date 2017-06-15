/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import th from 'triggerhappy';

import panjs from '../../src/';

import {extractTransform, extractStyleProp, resizeEvent} from './utils';

let element;

describe('events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('onMouseMove, onMouseEnter, onMouseLeave', () => {
    it('panjs should set style to element', (done) => {
      const node = element.querySelector('.img-wrapper');
      const img = element.querySelector('.img-wrapper img');
      const pan = panjs(node, {
        offset: {x: 0, y: 0}
      });

      const { top, left, width, height } = node.getBoundingClientRect();
      const { top: imgTop, left: imgLeft, width: imgWidth, height: imgHeight } = img.getBoundingClientRect();
      th.fire('MouseEvent', 'mouseenter', img, { clientX: 20, clientY: 20})
      const load = th.load('MouseEvent', 'mousemove', img, { clientX: 20, clientY: 20})
      th.spray(load, {
        speed: 10,
        steps: 81,
        path: { clientX: 10, clientY: 0 },
        tick: ({clientX, clientY}, index) => {
          const clientMovedX = clientX - left;
          const clientMovedY = clientY - top;
          const movedX = parseInt((imgWidth - width) * (clientMovedX / width));
          const movedY = parseInt((imgHeight - height) * (clientMovedY / height));
          const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
          const preOffset = extractStyleProp(preTranslate);

          expect(parseInt(preOffset[0], 10)).to.eql(-(movedX));
          expect(parseInt(preOffset[1], 10)).to.eql(-(movedY));
        }
      }).then(() => {
        done();
      })

    });

    it('panjs should set style to element x-axis if we lock y-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const img = element.querySelector('.img-wrapper img');
      const pan = panjs(node, {
        yAxisLock: true,
      });

      const { top, left, width, height } = node.getBoundingClientRect();
      const { top: imgTop, left: imgLeft, width: imgWidth, height: imgHeight } = img.getBoundingClientRect();
      th.fire('MouseEvent', 'mouseenter', img, { clientX: 20, clientY: 20})
      const load = th.load('MouseEvent', 'mousemove', img, { clientX: 20, clientY: 20})
      th.spray(load, {
        speed: 10,
        steps: 81,
        path: { clientX: 10, clientY: 10 },
        tick: ({clientX, clientY}, index) => {
          const clientMovedX = clientX - left;
          const clientMovedY = clientY - top;
          const movedX = parseInt((imgWidth - width) * (clientMovedX / width));
          const movedY = parseInt((imgHeight - height) * (clientMovedY / height));
          const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
          const preOffset = extractStyleProp(preTranslate);

          expect(clientY).not.to.eql(0)
          expect(parseInt(preOffset[0], 10)).to.eql(-(movedX));
          expect(parseInt(preOffset[1], 10)).to.eql(0);
        }
      }).then(() => {
        done();
      })
    });

    it('panjs should set style to element y-axis if we lock x-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const img = element.querySelector('.img-wrapper img');
      const pan = panjs(node, {
        xAxisLock: true,
      });
      const { top, left, width, height } = node.getBoundingClientRect();
      const { top: imgTop, left: imgLeft, width: imgWidth, height: imgHeight } = img.getBoundingClientRect();
      th.fire('MouseEvent', 'mouseenter', img, { clientX: 20, clientY: 20})
      const load = th.load('MouseEvent', 'mousemove', img, { clientX: 20, clientY: 20})
      th.spray(load, {
        speed: 10,
        steps: 81,
        path: { clientX: 10, clientY: 10 },
        tick: ({clientX, clientY}, index) => {
          const clientMovedX = clientX - left;
          const clientMovedY = clientY - top;
          const movedX = parseInt((imgWidth - width) * (clientMovedX / width));
          const movedY = parseInt((imgHeight - height) * (clientMovedY / height));
          const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
          const preOffset = extractStyleProp(preTranslate);

          expect(clientX).not.to.eql(0)
          expect(parseInt(preOffset[0], 10)).to.eql(0);
          expect(parseInt(preOffset[1], 10)).to.eql(-(movedY));
        }
      }).then(() => {
        done();
      })
    });
  });

  describe('onResize', () => {
    it('panjs should set style to element y-axis if we lock x-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const pan = panjs(node);
      resizeEvent(window, 100)
      .then(() => {
        done();
      });
    });
  });
});
