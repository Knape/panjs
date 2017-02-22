/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';
import {extractTransform, extractStyleProp, mouseEvent, resizeEvent} from './utils';

let element;
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
    it('panjs should set style to element', (done) => {
      const node = element.querySelector('.img-wrapper');
      const pan = panjs(node);
      const { top, left } = node.getBoundingClientRect();
      mouseEvent('mousemove', node, 100, coordSequence[1])
      .then(() => {
        const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
        const preOffset = extractStyleProp(preTranslate);
        expect(parseInt(preOffset[0], 10)).to.eql(-(coordSequence[1].clientX - left));
        expect(parseInt(preOffset[1], 10)).to.eql(-(coordSequence[1].clientY - top));
        return mouseEvent('mousemove', node, 100, coordSequence[2]);
      })
      .then(() => {
        const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
        const preOffset = extractStyleProp(preTranslate);
        expect(parseInt(preOffset[0], 10)).to.eql(-(coordSequence[2].clientX - left));
        expect(parseInt(preOffset[1], 10)).to.eql(-(coordSequence[2].clientY - top));
        done();
      });
    });

    it('panjs should set style to element x-axis if we lock y-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const pan = panjs(node, {
        yAxisLock: true,
      });
      const { top, left } = node.getBoundingClientRect();
      mouseEvent('mouseenter', node, 0, coordSequence[0])
      .then(() => mouseEvent('mousemove', node, 200, coordSequence[2]))
      .then(() => mouseEvent('mouseleave', node, 200, coordSequence[2]))
      .then(() => {
        const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
        const preOffset = extractStyleProp(preTranslate);
        expect(parseInt(preOffset[0], 10)).to.eql(-(coordSequence[2].clientX - left));
        expect(parseInt(preOffset[1], 10)).not.to.eql(-(coordSequence[2].clientY - top));
        expect(parseInt(preOffset[1], 10)).to.eql(0);
        done();
      });
    });

    it('panjs should set style to element y-axis if we lock x-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const pan = panjs(node, {
        xAxisLock: true,
      });
      const { top, left } = node.getBoundingClientRect();
      mouseEvent('mouseenter', node, 0, coordSequence[0])
      .then(() => mouseEvent('mousemove', node, 200, coordSequence[2]))
      .then(() => {
        const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
        const preOffset = extractStyleProp(preTranslate);
        expect(parseInt(preOffset[0], 10)).not.to.eql(-(coordSequence[2].clientX - left));
        expect(parseInt(preOffset[0], 10)).to.eql(0);
        expect(parseInt(preOffset[1], 10)).to.eql(-(coordSequence[2].clientY - top));
        done();
      });
    });
  });

  describe('onResize', () => {
    it('panjs should set style to element y-axis if we lock x-axix', (done) => {
      const node = element.querySelector('.img-wrapper');
      const pan = panjs(node);
      resizeEvent(window, 100)
      .then(() => {
        console.log(pan);
        console.log('resize sent');
        done();
      });
    });
  });
});
