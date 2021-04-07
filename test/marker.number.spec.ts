/* global describe, it */
import {expect} from 'chai';
import {createEmptyMarker} from './markerUtils';
import {MarkerType, MetaData} from '../src/marker/metaData';
import MarkerFactory from '../src/marker/markerFactory';

describe('Given marker module with numerical data', () => {
    it('should populate displayVal field with full range', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '1', end: '5'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayData).to.equal('1 - 5');
        expect(marker.data.range?.start).to.not.be.undefined;
        expect(marker.data.range?.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only start', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '1'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayData).to.equal('1 - ');
        expect(marker.data.range?.start).to.not.be.undefined;
        expect(marker.data.range?.end).to.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with only end', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {end: '5'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayData).to.equal(' - 5');
        expect(marker.data.range?.start).to.be.undefined;
        expect(marker.data.range?.end).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should populate displayVal field with single value', async () => {
        let marker = createEmptyMarker();
        marker.data.value = '7';
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.displayData).to.equal('7');
        expect(marker.data.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should convert range from string to number', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '2', end: '7'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.data.range?.start).to.be.a('number');
        expect(marker.data.range?.end).to.be.a('number');
        expect(marker.originalData?.range).to.not.be.undefined;
        expect(marker.data.value).to.be.undefined;
    });

    it('should convert value from string to date', async () => {
        let marker = createEmptyMarker();
        marker.data.value = '9';
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.data.value).to.be.a('number');
        expect(marker.originalData?.value).to.not.be.undefined;
        expect(marker.data.range).to.be.undefined;
    });

    it('should return in range if data range in slider range (range)', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '3', end: '7'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([1, 5], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data range not in slider range (range)', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '3', end: '4'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([1, 2], {} as MetaData)).to.be.false;
    });

    it('should return in range if data value in slider range (value)', async () => {
        let marker = createEmptyMarker();
        marker.data.value = '3';
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([1, 5], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in slider range (value)', async () => {
        let marker = createEmptyMarker();
        marker.data.value = '7';
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([1, 5], {} as MetaData)).to.be.false;
    });

    it('should return in range if slider value in data range (range)', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '1', end: '7'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([5], {} as MetaData)).to.be.true;
    });

    it('should return not in range if data value not in data range (range)', async () => {
        let marker = createEmptyMarker();
        marker.data.range = {start: '1', end: '2'};
        marker = await MarkerFactory.create(marker, MarkerType.NUMBER);

        expect(marker.isInRange([4], {} as MetaData)).to.be.false;
    });
});
