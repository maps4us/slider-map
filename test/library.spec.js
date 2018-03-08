/* global describe, it, before */
import chai from 'chai';
import {TimeLineMap} from '../dist/TimeLineMap.js';
chai.expect();

const expect = chai.expect;

describe('Given a TimeLineMap', () => {
    it('should be a class/constructor(function)', () => {
        expect(TimeLineMap).to.be.an('function');
    });
});

