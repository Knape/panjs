/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import { getOffsetProcent, getOffsetPixel, moveEl, getWidth, getHeight } from '../../src/utils';
import { mouseEvent, extractTransform, extractStyleProp } from './utils';
let element;

const coordSequence = [
  { clientX: 0, clientY: 10},
  { clientX: 10, clientY: 20},
  { clientX: 20, clientY: 30},
  { clientX: 40, clientY: 30}
];

const calc = (node, coords) => {
  const {
    width, height, left, top
  } = node.getBoundingClientRect();
  return {
    x: Math.abs((left - coords.clientX) / width),
    y: Math.abs((top - coords.clientY) / height),
  };
};

describe('pinch helpers', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('getOffsetProcent()', () => {
    it('has to be a function', () => {
      expect(typeof getOffsetProcent).to.eql('function');
    });

    it('should calculate the correct offset', (done) => {
      const node = element.querySelector('.img-wrapper');
      const img = element.querySelector('.img-wrapper img');
      const { x, y} = calc(node, coordSequence[1]);
      mouseEvent('mousemove', img, 100, coordSequence[1])
      .then(({el, event}) => {
        const offset = getOffsetProcent(Object.assign({}, event, {
          currentTarget: el,
        }), node.getBoundingClientRect());
        expect(offset.x).to.eql(0.02);
        expect(offset.y).to.eql(0.12);
        done();
      });
    });

    it('should calculate the correct offset', (done) => {
      const node = element.querySelector('.img-wrapper');
      const img = element.querySelector('.img-wrapper img');
      const { x, y} = calc(node, coordSequence[2]);
      mouseEvent('mousemove', img, 100, coordSequence[2])
      .then(({el, event}) => {
        const offset = getOffsetProcent(Object.assign({}, event, {
          currentTarget: el,
        }), node.getBoundingClientRect());
        expect(offset.x).to.eql(x);
        expect(offset.y).to.eql(y);
        done();
      });
    });
  });

  describe('getOffsetPixel()', () => {
    it('has to be a function', () => {
      expect(typeof getOffsetPixel).to.eql('function');
    });

    it('should convert offset in procent to px', () => {
      const node = element.querySelector('.img-wrapper');
      const image = element.querySelector('img');
      const {x, y} = getOffsetPixel(image.getBoundingClientRect(), node.getBoundingClientRect(), {x: -0.5, y: -0.5});
      expect(x).to.eql(-50);
      expect(y).to.eql(-50);
    });
  });

  describe('moveEl()', () => {
    it('has to be a function', () => {
      expect(typeof moveEl).to.eql('function');
    });

    it('should transform translet to image', () => {
      const node = element.querySelector('.img-wrapper');
      const image = element.querySelector('img');
      // The node should be 100px
      moveEl(image, image.getBoundingClientRect(), node.getBoundingClientRect(), {x: -50, y: -50});
      const hasTranslate = !!image.outerHTML.indexOf('transform');
      expect(hasTranslate).to.eql(true);
    });
  });
});
