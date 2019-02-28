/* global describe, it, before */
import {dateFromString} from '../src/date/conversion';
import {formatDate} from '../src/date/format';
import {DateMode} from '../src/date/dateMode';
import {expect} from 'chai';

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
});
