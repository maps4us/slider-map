/* global describe, it, before */
import {getDimensions} from '../src/map/pin';
import {expect} from 'chai';

describe('Given pin getDimensions method', () => {
    it('should update dimensions greater than 32', async () => {
        const dimensions = await getDimensions({height: 256, width: 180});
        expect(dimensions).to.deep.equal({
            height: 45.51111111111111,
            width: 32
        });
    });

    it('should not update dimension less than 32', async () => {
        const dimensions = await getDimensions({height: 22, width: 22});
        expect(dimensions).to.deep.equal({
            height: 22,
            width: 22
        });
    });
});
