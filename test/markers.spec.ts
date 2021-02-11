/* global describe, it, before */
import {expect} from 'chai';
import {createEmptyMarker} from './markerUtils';
import {MetaData} from '../src/marker/metaData';

describe('Given marker module', () => {
    it('should populate displayVal field with full range', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001', end: '2002'};

        marker.init(true);

        expect(marker.displayData).to.equal('2001 - 2002');
        expect(marker.data.range.start).to.not.be.undefined;
        expect(marker.data.range.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only start', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001'};

        marker.init(true);

        expect(marker.displayData).to.equal('2001 - present');
        expect(marker.data.range.start).to.not.be.undefined;
        expect(marker.data.range.end).to.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only end', () => {
        const marker = createEmptyMarker();

        marker.data.range = {end: '2002'};

        marker.init(true);

        expect(marker.displayData).to.equal('beginning - 2002');
        expect(marker.data.range.start).to.be.undefined;
        expect(marker.data.range.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with single value', () => {
        const marker = createEmptyMarker();

        marker.data.value = '2001';

        marker.init(true);

        expect(marker.displayData).to.equal('2001');
        expect(marker.data.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should create display location from city, state, country', () => {
        const marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.state = 'WA';
        marker.location.country = 'USA';

        marker.init(true);

        expect(marker.displayLocation).to.equal('Seattle, WA, USA');
    });

    it('should create display location from city, country', () => {
        const marker = createEmptyMarker();

        marker.location.city = 'Seattle';
        marker.location.country = 'USA';

        marker.init(true);

        expect(marker.displayLocation).to.equal('Seattle, USA');
    });

    it('should convert lat and long to number', () => {
        const marker = createEmptyMarker();

        marker.location.lat = '42.5';
        marker.location.long = '42.5';

        marker.init(true);

        expect(marker.lat).to.be.a('number');
        expect(marker.lng).to.be.a('number');
    });

    it('should convert range from string to date', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001', end: '2002'};

        marker.init(true);

        expect(marker.data.range.start).to.be.a('date');
        expect(marker.data.range.end).to.be.a('date');
        expect(marker.originalData.range).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should convert value from string to date', () => {
        const marker = createEmptyMarker();

        marker.data.value = '2001';

        marker.init(true);

        expect(marker.data.value).to.be.a('date');
        expect(marker.originalData.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should return in range if data range in slider range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2007'};

        marker.init(true);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data range not in slider range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2002'};

        marker.init(true);

        const start = new Date('1999').getTime();
        const end = new Date('2000').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.false;
    });

    it('should return in range if data value in slider range (value)', () => {
        const marker = createEmptyMarker();
        marker.data.value = '2001';

        marker.init(true);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in slider range (value)', () => {
        const marker = createEmptyMarker();
        marker.data.value = '2007';

        marker.init(true);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.false;
    });

    it('should return in range if slider value in data range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2007'};

        marker.init(true);

        const value = new Date('2005').getTime();
        expect(marker.isInRange([value], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in data range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2002'};

        marker.init(true);

        const value = new Date('1999').getTime();
        expect(marker.isInRange([value], {} as MetaData)).to.be.false;
    });
});
