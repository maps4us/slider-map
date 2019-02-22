/* global describe, it, before */
import * as dateHelper from '../src/date';
import {expect} from 'chai';

describe('Given a dateHelper', () => {
    it('no year returns null', () => {
        const date = dateHelper.createDate(null, null);
        expect(date).to.be.null;
    });

    it('should format year date to yyyy', () => {
        const date = dateHelper.createDate(null, '1997');

        expect(date).to.not.be.null;
        if (date !== null) {
            const dateStr = dateHelper.formatDate(date, dateHelper.DateMode.YEAR_DATES);
            expect(dateStr).to.equal('1997');
        }
    });

    it('should format year date to m/yyyy', () => {
        const date = dateHelper.createDate(null, '2/1997');

        expect(date).to.not.be.null;
        if (date !== null) {
            const dateStr = dateHelper.formatDate(date, dateHelper.DateMode.YEAR_MONTH_DATES);
            expect(dateStr).to.equal('2/1997');
        }
    });

    it('should format year date to m/d/yyyy', () => {
        const date = dateHelper.createDate(null, '1/2/1997');

        expect(date).to.not.be.null;
        if (date !== null) {
            const dateStr = dateHelper.formatDate(date, dateHelper.DateMode.YEAR_MONTH_DAY_DATES);
            expect(dateStr).to.equal('1/2/1997');
        }
    });

    it('should return min year', () => {
        const markers: dateHelper.ProcessedMarker[] = [];
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1981') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1992') as Date
        });
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1975') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1992') as Date
        });
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1965') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1992') as Date
        });

        const minYear = dateHelper.getMinYear(markers);
        const dateStr = dateHelper.formatDate(minYear, dateHelper.DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/1/1965');
    });

    it('should return max year', () => {
        const markers: dateHelper.ProcessedMarker[] = [];
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1981') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1992') as Date
        });
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1975') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1997') as Date
        });
        markers.push({
            dateStart: dateHelper.createDate(null, '1/1/1965') as Date,
            dateEnd: dateHelper.createDate(null, '5/6/1999') as Date
        });

        const maxYear = dateHelper.getMaxYear(markers);
        const dateStr = dateHelper.formatDate(maxYear, dateHelper.DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('12/31/1999');
    });

    it('should return date mode years', () => {
        const markers: dateHelper.Marker[] = [];
        markers.push({dateStart: '1981', dateEnd: '1992'});
        markers.push({dateStart: '1975', dateEnd: '1997'});
        markers.push({dateStart: '1965', dateEnd: '1999'});

        const dateMode = dateHelper.getDateMode(markers);
        expect(dateMode).to.equal(dateHelper.DateMode.YEAR_DATES);
    });

    it('should return date mode month/years', () => {
        const markers: dateHelper.Marker[] = [];
        markers.push({dateStart: '1981', dateEnd: '2/1992'});
        markers.push({dateStart: '2/1975', dateEnd: '1997'});
        markers.push({dateStart: '1965', dateEnd: '2/1999'});

        const dateMode = dateHelper.getDateMode(markers);
        expect(dateMode).to.equal(dateHelper.DateMode.YEAR_MONTH_DATES);
    });

    it('should return date mode day/month/years', () => {
        const markers: dateHelper.Marker[] = [];
        markers.push({dateStart: '1981', dateEnd: '2/1992'});
        markers.push({dateStart: '2/1975', dateEnd: '1997'});
        markers.push({dateStart: '1965', dateEnd: '1/1/1999'});

        const dateMode = dateHelper.getDateMode(markers);
        expect(dateMode).to.equal(dateHelper.DateMode.YEAR_MONTH_DAY_DATES);
    });
});
