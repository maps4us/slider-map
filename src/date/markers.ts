import {Marker} from '../marker/markers';
import {dateFromString} from './conversion';

export enum DateMode {
    NO_DATES = -1,
    YEAR_DATES,
    YEAR_MONTH_DATES,
    YEAR_MONTH_DAY_DATES
}

export function hasDates(dateMode: DateMode): boolean {
    return dateMode !== DateMode.NO_DATES;
}

export function getDateMode(markers: Marker[]): DateMode {
    let dateMode: DateMode = DateMode.NO_DATES;

    markers.forEach(marker => {
        let count = 0;
        let dateStart = marker.dateStart ? marker.dateStart : marker.yearFrom;
        if (dateStart != null && dateStart !== '') {
            count = (dateStart.match(/\//g) || []).length;
        }

        let dateEnd = marker.dateEnd ? marker.dateEnd : marker.yearTo;
        if (dateEnd != null && dateEnd !== '') {
            const countEnd = (dateEnd.match(/\//g) || []).length;
            // check if bigger
            count = Math.max(count, countEnd);
        }

        if (count > dateMode) {
            dateMode = count;

            if (dateMode === DateMode.YEAR_MONTH_DAY_DATES) {
                return;
            }
        }
    });

    return dateMode;
}

export function getMinDate(markers: Marker[]): Date {
    let minYear = new Date().getFullYear();

    markers.forEach(marker => {
        if (marker.dateRange && marker.dateRange.start && marker.dateRange.start.getFullYear() < minYear) {
            minYear = marker.dateRange.start.getFullYear();
        }
    });

    return dateFromString('1/1/' + minYear) as Date;
}

export function getMaxDate(markers: Marker[]): Date {
    const todayYear = new Date();
    let maxYear = 0;

    markers.forEach(marker => {
        let dateEnd = todayYear;
        if (marker.dateRange && marker.dateRange.end) {
            dateEnd = marker.dateRange.end;
        }

        if (dateEnd.getFullYear() > maxYear) {
            maxYear = dateEnd.getFullYear();
        }
    });

    return dateFromString('12/31/' + maxYear) as Date;
}
