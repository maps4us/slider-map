/* global describe, it, before */
import {TimeLineMap} from '../dist/TimeLineMap.js';
import {expect} from 'chai';

describe('Given a TimeLineMap', () => {
    it('should be a class/constructor(function)', () => {
        expect(TimeLineMap).to.be.an('function');
    });
});
