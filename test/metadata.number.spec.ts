/* global describe, it */
import {MarkerType, MetaData} from '../src/marker/metaData';
import Marker from '../src/marker/marker';
import {expect} from 'chai';
import {markerWithRange, markerWithValue} from './markerUtils';

function createEmptyMetaData(): MetaData {
    const metaData = {
        pin: '',
        icon: '',
        publishedDate: '',
        title: '',
        markerType: MarkerType.NUMBER,
    };

    return Object.assign(new MetaData(), metaData);
}

describe('Given metaData functions with numerical markers', () => {
    it('should return min number (all range)', () => {
        const markers: Marker[] = [];

        markers.push(markerWithRange(1, 7));
        markers.push(markerWithRange(2, 3));
        markers.push(markerWithRange(2, 6));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.min).to.equal(1);
    });

    it('should return min number (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue(5));
        markers.push(markerWithValue(1));
        markers.push(markerWithValue(7));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.min).to.equal(1);
    });

    it('should return min number (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange(2, 4));
        markers.push(markerWithRange(5, 8));
        markers.push(markerWithValue(1));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.min).to.equal(1);
    });

    it('should return max number (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange(3, 4));
        markers.push(markerWithRange(1, 3));
        markers.push(markerWithRange(2, 9));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.max).to.equal(9);
    });

    it('should return max number (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue(3));
        markers.push(markerWithValue(7));
        markers.push(markerWithValue(5));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.max).to.equal(7);
    });

    it('should return max number (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange(1, 6));
        markers.push(markerWithRange(3, 7));
        markers.push(markerWithValue(9));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.max).to.equal(9);
    });
});
