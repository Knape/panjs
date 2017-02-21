/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panjs from '../../src/';
import {extractTransform, extractStyleProp} from './utils';

let element;

describe('panjs()', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    sinon.spy(console, 'warn');
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
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
    const node = element.querySelector('img-wrapper');
    panjs(node);
    expect(console.warn).not.to.have.been.called;
  });

  it('otherwise it should warn', () => {
    panjs();
    expect(console.warn).to.have.been.called;
  });

  it('should allow to pass options', () => {
    panjs('.img-wrapper', {
      offset: {x: 0, y: 0},
    });
  });

  it('should have methods', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node);
    expect(typeof pan.setup).to.eql('function');
    expect(typeof pan.destroy).to.eql('function');
    expect(typeof pan.reset).to.eql('function');
    expect(typeof pan.getOffset).to.eql('function');
  });

  it('should have element and offset', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node);
    expect(typeof pan.element).to.eql('object');
    expect(typeof pan.getOffset()).to.eql('object');
  });

  it('should have offset eql to default offset', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node);
    expect(pan.getOffset()).to.deep.eql({x: 0, y: 0});
  });

  it('should have offset eql to props offset', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node, { offset: { x: 20, y: 20}});
    expect(pan.getOffset()).to.deep.eql({x: 20, y: 20});
  });


  it('should be able to reset', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node, { offset: { x: 0.2, y: 0.2}});
    const postTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
    const postOffset = extractStyleProp(postTranslate);
    expect(postOffset).to.deep.eql([-20, -20]);
    pan.reset({offset: {x: 0, y: 0}});
    const preTranslate = extractTransform(pan.element.childNodes[1].style.transform, 'translate');
    const preOffset = extractStyleProp(preTranslate);
    expect(preOffset).to.deep.eql([0,0]);
  });

  it('should be able to destroy', () => {
    const node = element.querySelector('.img-wrapper');
    const pan = panjs(node, { offset: { x: 20, y: 20}});
    pan.destroy();
  });
});
