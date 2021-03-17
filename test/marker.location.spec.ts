/* global describe, it */
import {expect} from 'chai';
import {createEmptyMarker} from './markerUtils';
import {MarkerType} from '../src/marker/metaData';
import MarkerFactory from '../src/marker/markerFactory';

describe('Given marker module', () => {
    it('should create display location from city, state, country', async () => {
        let marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.state = 'WA';
        marker.location.country = 'USA';

        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayLocation).to.equal('Seattle, WA, USA');
    });

    it('should create display location from city, country', async () => {
        let marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.country = 'USA';

        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayLocation).to.equal('Seattle, USA');
    });

    it('should convert lat and long to number', async () => {
        let marker = createEmptyMarker();

        marker.location.lat = '42.5';
        marker.location.long = '42.5';

        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.lat).to.be.a('number');
        expect(marker.lng).to.be.a('number');
    });
});
