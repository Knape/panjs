/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';
import {extractTransform, extractStyleProp, mouseEvent, resizeEvent} from './utils';

let element;
let node;
let pan;

const coordSequence = [
  { clientX: 0, clientY: 10},
  { clientX: 10, clientY: 20},
  { clientX: 20, clientY: 30},
  { clientX: 40, clientY: 30}
];

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
      mouseEvent('mousemove', node, 100, coordSequence[1]);
      pan.on('mousemove', () => done());
    });

    it('should fire mouseenter event', (done) => {
      mouseEvent('mouseenter', node, 100, coordSequence[1]);
      pan.on('mouseenter', () => done());
    });

    it('should fire mouseleave event', (done) => {
      mouseEvent('mouseleave', node, 100, coordSequence[1]);
      pan.on('mouseleave', () => done());
    });
  });
});
