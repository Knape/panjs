/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';
import {extractTransform, extractStyleProp, mouseEvent, resizeEvent, mousePoint, mouseAnimate} from './utils';

let element;
let node;
let pan;

describe('events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('onMouseMove, onMouseEnter, onMouseLeave', () => {
    beforeEach(() => {
      node = element.querySelector('.img-wrapper');
      pan = panjs(node);
    });

    it('should fire mousemove event', (done) => {
      const basePoint = mousePoint(node, 0.5, 0.5);
      mouseEvent('mousemove', node, 100, basePoint(1));
      pan.on('mousemove', () => {
        done();
      });
    });

    it('should fire mouseenter event', (done) => {
      const basePoint = mousePoint(node, 0.5, 0.5);
      mouseEvent('mouseenter', node, 100, basePoint(1));
      pan.on('mouseenter', () => done());
    });

    it('should fire mouseleave event', (done) => {
      const basePoint = mousePoint(node, 0.5, 0.5);
      mouseEvent('mouseleave', node, 100, basePoint(1));
      pan.on('mouseleave', () => done());
    });
  });
});
