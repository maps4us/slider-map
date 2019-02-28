/* global describe, it, before */
import {dateFromString} from '../src/date/conversion';
import {formatDate} from '../src/date/format';
import {getMinDate, getMaxDate, getDateMode} from '../src/marker/fetch';
import {DateMode} from '../src/date/dateMode';
import {Marker} from '../src/marker/marker';
import {expect} from 'chai';

function createEmptyMarker(): Marker {
    const marker = {
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

    return Object.assign(new Marker(), marker);
}

describe('Given marker module', () => {
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
            start: dateFromString('1/5/1965'),
            end: dateFromString('5/6/1992')
        };

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const minYear = getMinDate(markers);
        const dateStr = formatDate(minYear, DateMode.YEAR_MONTH_DAY_DATES);
        expect(dateStr).to.equal('1/5/1965');
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
        expect(dateStr).to.equal('5/6/1999');
    });

    it('should return date mode no date', () => {
        const markers: Marker[] = [];
        let marker1 = createEmptyMarker();
        marker1.dateStart = '';
        marker1.dateEnd = '0';

        let marker2 = createEmptyMarker();
        marker2.dateEnd = '0';

        let marker3 = createEmptyMarker();
        marker3.dateStart = '';

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);

        const dateMode = getDateMode(markers);
        expect(dateMode).to.equal(DateMode.NO_DATES);
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

    it('should populate date range field', () => {
        let marker = createEmptyMarker();

        marker.dateStart = '2001';
        marker.dateEnd = '2002';

        marker.process(true);

        expect(marker.dateRange.displayStr).to.equal('2001 - 2002');
        expect(marker.dateRange.start).to.not.be.undefined;
        expect(marker.dateRange.end).to.not.be.undefined;
    });

    it('should populate date range field with only start', () => {
        let marker = createEmptyMarker();

        marker.dateStart = '2001';

        marker.process(true);

        expect(marker.dateRange.displayStr).to.equal('2001 - present');
        expect(marker.dateRange.start).to.not.be.undefined;
        expect(marker.dateRange.end).to.be.undefined;
    });

    it('should populate date range field with only end', () => {
        let marker = createEmptyMarker();

        marker.dateEnd = '2002';

        marker.process(true);

        expect(marker.dateRange.displayStr).to.equal('beginning - 2002');
        expect(marker.dateRange.start).to.be.undefined;
        expect(marker.dateRange.end).to.not.be.undefined;
    });

    it('should extract display location from generated', () => {
        let marker = createEmptyMarker();

        marker.generated = {
            location: 'Seattle, WA, USA'
        };

        marker.process(false);

        expect(marker.displayLocation).to.equal('Seattle, WA, USA');
    });

    it('should create display location from city, state, country', () => {
        let marker = createEmptyMarker();

        marker.city = 'Seattle';
        marker.state = 'WA';
        marker.country = 'USA';

        marker.process(false);

        expect(marker.displayLocation).to.equal('Seattle, WA, USA');
    });

    it('should create display location from city, country', () => {
        let marker = createEmptyMarker();

        marker.city = 'Seattle';
        marker.country = 'USA';

        marker.process(false);

        expect(marker.displayLocation).to.equal('Seattle, USA');
    });

    it('should convert lat and long to number', () => {
        let marker = createEmptyMarker();

        marker.lat = '42.5';
        marker.long = '42.5';

        marker.process(false);

        expect(marker.lat).to.be.a('number');
        expect(marker.lng).to.be.a('number');
    });
});
