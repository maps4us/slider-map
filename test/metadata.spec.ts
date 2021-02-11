/* global describe, it, before */
import {formatDate} from '../src/date/format';
import {MarkerType, MetaData} from '../src/marker/metaData';
import {DateMode} from '../src/date/dateMode';
import {Marker} from '../src/marker/marker';
import {expect} from 'chai';
import {markerWithRange, markerWithValue, createEmptyMarker} from './markerUtils';

function createEmptyMetaData(): MetaData {
    const metaData = {
        pin: '',
        icon: '',
        publishedDate: '',
        title: '',
        markerType: MarkerType.DATE
    };

    return Object.assign(new MetaData(), metaData);
}

describe('Given metaData functions', () => {
    it('should return min year (all range)', () => {
        const markers: Marker[] = [];

        markers.push(markerWithRange('1/1/1981', '5/6/1992'));
        markers.push(markerWithRange('1/1/1975', '5/6/1992'));
        markers.push(markerWithRange('1/5/1965', '5/6/1992'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.min as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/5/1965');
    });

    it('should return min year (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue('1/1/1981'));
        markers.push(markerWithValue('5/6/1992'));
        markers.push(markerWithValue('1/5/1965'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.min as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/5/1965');
    });

    it('should return min year (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1/1/1981', '5/6/1992'));
        markers.push(markerWithRange('1/1/1975', '5/6/1992'));
        markers.push(markerWithValue('1/5/1965'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.min as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/5/1965');
    });

    it('should return max year (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1/1/1981', '5/6/1992'));
        markers.push(markerWithRange('1/1/1975', '5/6/1997'));
        markers.push(markerWithRange('1/1/1965', '5/6/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.max as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('5/6/1999');
    });

    it('should return max year (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue('1/1/1981'));
        markers.push(markerWithValue('5/6/1997'));
        markers.push(markerWithValue('5/6/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.max as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('5/6/1999');
    });

    it('should return max year (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1/1/1981', '5/6/1992'));
        markers.push(markerWithRange('1/1/1975', '5/6/1997'));
        markers.push(markerWithValue('5/6/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        const dateStr = formatDate(metaData.max as Date, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('5/6/1999');
    });

    it('should return date mode: no date', () => {
        const markers: Marker[] = [];
        markers.push(createEmptyMarker());
        markers.push(createEmptyMarker());
        markers.push(createEmptyMarker());

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.NO_DATES);
    });

    it('should return date mode years (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '1992'));
        markers.push(markerWithRange('1975', '1997'));
        markers.push(markerWithRange('1965', '1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_DATES);
    });

    it('should return date mode years (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue('1992'));
        markers.push(markerWithValue('1997'));
        markers.push(markerWithValue('1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_DATES);
    });

    it('should return date mode years (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '1992'));
        markers.push(markerWithRange('1975', '1997'));
        markers.push(markerWithValue('1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_DATES);
    });

    it('should return date mode month/years (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '2/1992'));
        markers.push(markerWithRange('2/1975', '1997'));
        markers.push(markerWithRange('1965', '2/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DATES);
    });

    it('should return date mode month/years (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue('1981'));
        markers.push(markerWithValue('2/1975'));
        markers.push(markerWithValue('2/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DATES);
    });

    it('should return date mode month/years (mix)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '2/1992'));
        markers.push(markerWithRange('2/1975', '1997'));
        markers.push(markerWithValue('2/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DATES);
    });

    it('should return date mode day/month/years (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '2/1992'));
        markers.push(markerWithRange('2/1975', '1997'));
        markers.push(markerWithRange('1965', '1/1/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DAY_DATES);
    });

    it('should return date mode day/month/years (all value)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithValue('2/1992'));
        markers.push(markerWithValue('1997'));
        markers.push(markerWithValue('1/1/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DAY_DATES);
    });

    it('should return date mode day/month/years (all range)', () => {
        const markers: Marker[] = [];
        markers.push(markerWithRange('1981', '2/1992'));
        markers.push(markerWithRange('2/1975', '1997'));
        markers.push(markerWithValue('1/1/1999'));

        const metaData = createEmptyMetaData();
        metaData.init(markers);
        expect(metaData.dateMode).to.equal(DateMode.YEAR_MONTH_DAY_DATES);
    });
});
