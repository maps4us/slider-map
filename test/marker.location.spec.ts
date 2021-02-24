/* global describe, it, before */
import {expect} from 'chai';
import {createEmptyMarker} from './markerUtils';
import {MarkerType} from '../src/marker/metaData';

describe('Given marker module', () => {
    it('should create display location from city, state, country', () => {
        const marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.state = 'WA';
        marker.location.country = 'USA';

        marker.init(MarkerType.NUMBER);

        expect(marker.displayLocation).to.equal('Seattle, WA, USA');
    });

    it('should create display location from city, country', () => {
        const marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.country = 'USA';

        marker.init(MarkerType.NUMBER);

        expect(marker.displayLocation).to.equal('Seattle, USA');
    });

    it('should convert lat and long to number', () => {
        const marker = createEmptyMarker();

        marker.location.lat = '42.5';
        marker.location.long = '42.5';

        marker.init(MarkerType.NUMBER);

        expect(marker.lat).to.be.a('number');
        expect(marker.lng).to.be.a('number');
    });
});
