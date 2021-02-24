/* global describe, it, before */
import {expect} from 'chai';
import {createEmptyMarker} from './markerUtils';
import {MarkerType, MetaData} from '../src/marker/metaData';

describe('Given marker module with date data', () => {
    it('should populate displayVal field with full range', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001', end: '2002'};

        marker.init(MarkerType.DATE);

        expect(marker.displayData).to.equal('2001 - 2002');
        expect(marker.data.range.start).to.not.be.undefined;
        expect(marker.data.range.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only start', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001'};

        marker.init(MarkerType.DATE);

        expect(marker.displayData).to.equal('2001 - present');
        expect(marker.data.range.start).to.not.be.undefined;
        expect(marker.data.range.end).to.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only end', () => {
        const marker = createEmptyMarker();

        marker.data.range = {end: '2002'};

        marker.init(MarkerType.DATE);

        expect(marker.displayData).to.equal('beginning - 2002');
        expect(marker.data.range.start).to.be.undefined;
        expect(marker.data.range.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with single value', () => {
        const marker = createEmptyMarker();

        marker.data.value = '2001';

        marker.init(MarkerType.DATE);

        expect(marker.displayData).to.equal('2001');
        expect(marker.data.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should convert range from string to date', () => {
        const marker = createEmptyMarker();

        marker.data.range = {start: '2001', end: '2002'};

        marker.init(MarkerType.DATE);

        expect(marker.data.range.start).to.be.a('date');
        expect(marker.data.range.end).to.be.a('date');
        expect(marker.originalData.range).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should convert value from string to date', () => {
        const marker = createEmptyMarker();

        marker.data.value = '2001';

        marker.init(MarkerType.DATE);

        expect(marker.data.value).to.be.a('date');
        expect(marker.originalData.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should return in range if data range in slider range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2007'};

        marker.init(MarkerType.DATE);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data range not in slider range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2002'};

        marker.init(MarkerType.DATE);

        const start = new Date('1999').getTime();
        const end = new Date('2000').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.false;
    });

    it('should return in range if data value in slider range (value)', () => {
        const marker = createEmptyMarker();
        marker.data.value = '2001';

        marker.init(MarkerType.DATE);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in slider range (value)', () => {
        const marker = createEmptyMarker();
        marker.data.value = '2007';

        marker.init(MarkerType.DATE);

        const start = new Date('1999').getTime();
        const end = new Date('2005').getTime();
        expect(marker.isInRange([start, end], {} as MetaData)).to.be.false;
    });

    it('should return in range if slider value in data range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2007'};

        marker.init(MarkerType.DATE);

        const value = new Date('2005').getTime();
        expect(marker.isInRange([value], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in data range (range)', () => {
        const marker = createEmptyMarker();
        marker.data.range = {start: '2001', end: '2002'};

        marker.init(MarkerType.DATE);

        const value = new Date('1999').getTime();
        expect(marker.isInRange([value], {} as MetaData)).to.be.false;
    });
});
