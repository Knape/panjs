/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */
import th from 'triggerhappy'

import panjs from '../../src/';

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
      pan.on('mousemove', () => { done() });
      th.fire('MouseEvent', 'mousemove', node)
    });

    it('should fire mouseenter event', (done) => {
      pan.on('mouseenter', () => { done() });
      th.fire('MouseEvent', 'mouseenter', node)
    });

    it('should fire mouseleave event', (done) => {
      pan.on('mouseleave', () => { done() });
      th.fire('mouseleave', 'mouseleave', node)
    });
  });
});
