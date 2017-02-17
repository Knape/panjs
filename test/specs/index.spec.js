/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import panGlide from '../../src/';

let element;

describe('pinchit()', () => {
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
    expect(typeof panGlide).to.eql('function');
  });
});
