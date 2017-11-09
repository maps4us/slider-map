/* global describe, it, before */
import chai from 'chai';
import * as MapModule from '../dist/TimeLineMap.min.js';
chai.expect();

const expect = chai.expect;

describe('Given an createMap', () => {
  it('createMap should be a function', () => {
    expect(MapModule.createMap).to.be.an('function');
  });
});

