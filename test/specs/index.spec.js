/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';
import {extractTransform, extractStyleProp} from './utils';

let firstElement;

describe('panjs()', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    sinon.spy(console, 'warn');
    fixture.load('test.html');
    firstElement = fixture.el.querySelector('.wrapper');
  });

  afterEach(() => {
    console.warn.restore();
  });

  it('has to be a function', () => {
    expect(typeof panjs).to.eql('function');
  });

  it('allows to pass a string as first argument', () => {
    panjs('.img-wrapper');
    expect(console.warn).not.to.have.been.called;
  });

  it('allows to pass an node as first argument', () => {
    const node = firstElement.querySelector('img-wrapper');
    panjs(node);
    expect(console.warn).not.to.have.been.called;
  });

  it('otherwise it should warn', () => {
    panjs();
    expect(console.warn).to.have.been.called;
  });


  describe('options', () => {
    it('should allow to pass offset options', () => {
      panjs('.img-wrapper', {
        offset: {x: 0.2, y: 0.2},
      });
    });

    it('should allow to pass target options', () => {
      const pan = panjs('.img-wrapper', {
        target: '.main-image-two',
        offset: {x: 0.2, y: 0.2},
      });
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([-70, -53]);
    });
  });

  describe('methods', () => {
    it('should exist', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node);
      expect(typeof pan.setup).to.eql('function');
      expect(typeof pan.destroy).to.eql('function');
      expect(typeof pan.reset).to.eql('function');
      expect(typeof pan.getOffset).to.eql('function');
    });

    it('should have element and offset', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node);
      expect(typeof pan.element).to.eql('object');
      expect(typeof pan.getOffset()).to.eql('object');
    });

    it('should have offset eql to default offset', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node);
      expect(pan.getOffset()).to.deep.eql({x: 0, y: 0});
    });

    it('should have offset eql to props offset', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0.20, y: 0.20}});
      expect(pan.getOffset()).to.deep.eql({x: 0.20, y: 0.20});
    });

    it('should be able to reset', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0.2, y: 0.2}});
      const postTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const postOffset = extractStyleProp(postTranslate);
      expect(postOffset).to.deep.eql([-70, -53]);
      pan.reset({offset: {x: 0, y: 0}});
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([0, 0]);
    });

    it('should be able to reset without any args and return to normal', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0.2, y: 0.2}});
      const postTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const postOffset = extractStyleProp(postTranslate);
      expect(postOffset).to.deep.eql([-70, -53]);
      pan.reset();
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([-70, -53]);
    });

    it('should be able to reset with custom values', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0, y: 0}});
      const postTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const postOffset = extractStyleProp(postTranslate);
      expect(postOffset).to.deep.eql([0, 0]);
      pan.reset({offset: {x: 0.2, y: 0.2}});
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([-70, -53]);
    });

    it('should be able to destroy', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0, y: 0}});
      pan.destroy();
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([0, 0]);
    });

    it('should be able to destroy with custom offset', () => {
      const node = firstElement.querySelector('.img-wrapper');
      const pan = panjs(node, { offset: { x: 0, y: 0}});
      pan.destroy({offset: { x: 0.2, y: 0.2}});
      const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
      const preOffset = extractStyleProp(preTranslate);
      expect(preOffset).to.deep.eql([-70, -53]);
    });
  })
});
