/* global describe, it, before */
import {fetch} from '../src/marker/fetch';
import {expect} from 'chai';

describe('Given fetch', () => {
    it('should return markers', async () => {
        const markers = await fetch('1512409330904', false);
        expect(markers).to.not.be.empty;
    });
});
