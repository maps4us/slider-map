/* global describe, it, before */
import {dateFromString} from '../src/date/conversion';
import {formatDate} from '../src/date/format';
import {DateMode, getMinDate, getMaxDate, getDateMode} from '../src/date/markers';
import {Marker} from '../src/marker/markers';
import {expect} from 'chai';

function createEmptyMarker(): Marker {
    return {
        lat: '',
        long: '',
        lng: 1,
        city: '',
        state: '',
        country: '',

        addInfo: '',
        icon: '',
        name: '',
        website: {
            title: '',
            url: ''
        },

        displayLocation: '',

        dateStart: '',
        dateEnd: '',
        dateRange: {
            displayStr: ''
        }
    };
}

describe('Given dates module', () => {
    it('no year returns undefined', () => {
        const date = dateFromString('');
        expect(date).to.be.undefined;
    });

    it('should format year date to yyyy', () => {
        const date = dateFromString('1997');

        expect(date).to.not.be.undefined;
        if (date) {
            const dateStr = formatDate(date, DateMode.YEAR_DATES);
            expect(dateStr).to.equal('1997');
        }
    });

    it('should format year date to m/yyyy', () => {
        const date = dateFromString('2/1997');

        expect(date).to.not.be.undefined;
        if (date) {
            const dateStr = formatDate(date, DateMode.YEAR_MONTH_DATES);
            expect(dateStr).to.equal('2/1997');
        }
    });

    it('should format year date to m/d/yyyy', () => {
        const date = dateFromString('1/2/1997');

        expect(date).to.not.be.undefined;
        if (date) {
            const dateStr = formatDate(date, DateMode.YEAR_MONTH_DAY_DATES);
            expect(dateStr).to.equal('1/2/1997');
        }
    });

    it('should return min year', () => {
        const markers: Marker[] = [];

        let marker1: Marker = createEmptyMarker();
        marker1.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1981'),
            end: dateFromString('5/6/1992')
        };

        let marker2 = createEmptyMarker();
        marker2.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1975'),
            end: dateFromString('5/6/1992')
        };

        let marker3 = createEmptyMarker();
        marker3.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1965'),
            end: dateFromString('5/6/1992')
        };

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const minYear = getMinDate(markers);
        const dateStr = formatDate(minYear, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/1/1965');
    });

    it('should return max year', () => {
        const markers: Marker[] = [];
        let marker1 = createEmptyMarker();
        marker1.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1981'),
            end: dateFromString('5/6/1992')
        };

        let marker2 = createEmptyMarker();
        marker2.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1975'),
            end: dateFromString('5/6/1997')
        };

        let marker3 = createEmptyMarker();
        marker3.dateRange = {
            displayStr: '',
            start: dateFromString('1/1/1965'),
            end: dateFromString('5/6/1999')
        };

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const maxYear = getMaxDate(markers);
        const dateStr = formatDate(maxYear, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('12/31/1999');
    });

    it('should return date mode years', () => {
        const markers: Marker[] = [];
        let marker1 = createEmptyMarker();
        marker1.dateStart = '1981';
        marker1.dateEnd = '1992';

        let marker2 = createEmptyMarker();
        marker2.dateStart = '1975';
        marker2.dateEnd = '1997';

        let marker3 = createEmptyMarker();
        marker3.dateStart = '1965';
        marker3.dateEnd = '1999';

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const dateMode = getDateMode(markers);
        expect(dateMode).to.equal(DateMode.YEAR_DATES);
    });

    it('should return date mode month/years', () => {
        const markers: Marker[] = [];
        let marker1 = createEmptyMarker();
        marker1.dateStart = '1981';
        marker1.dateEnd = '2/1992';

        let marker2 = createEmptyMarker();
        marker2.dateStart = '2/1975';
        marker2.dateEnd = '1997';

        let marker3 = createEmptyMarker();
        marker3.dateStart = '1965';
        marker3.dateEnd = '2/1999';

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const dateMode = getDateMode(markers);
        expect(dateMode).to.equal(DateMode.YEAR_MONTH_DATES);
    });

    it('should return date mode day/month/years', () => {
        const markers: Marker[] = [];
        let marker1 = createEmptyMarker();
        marker1.dateStart = '1981';
        marker1.dateEnd = '2/1992';

        let marker2 = createEmptyMarker();
        marker2.dateStart = '2/1975';
        marker2.dateEnd = '1997';

        let marker3 = createEmptyMarker();
        marker3.dateStart = '1965';
        marker3.dateEnd = '1/1/1999';

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const dateMode = getDateMode(markers);
        expect(dateMode).to.equal(DateMode.YEAR_MONTH_DAY_DATES);
    });
});
