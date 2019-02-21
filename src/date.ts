export enum DateMode {
    NO_DATES = -1,
    YEAR_DATES,
    YEAR_MONTH_DATES,
    YEAR_MONTH_DAY_DATES
}

export function formatDate(date: Date, mode: DateMode): string {
    if (mode === DateMode.YEAR_DATES) {
        return date.getFullYear().toString();
    } else if (mode === DateMode.YEAR_MONTH_DATES) {
        return date.getMonth() + 1 + '/' + date.getFullYear();
    } else if (mode === DateMode.YEAR_MONTH_DAY_DATES) {
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }

    return '';
}

export function hasDates(dateMode: DateMode): boolean {
    return dateMode !== DateMode.NO_DATES;
}

export function createDate(yearStr: string | null, dateStr: string | null): Date | null {
    const convertStr = dateStr != null ? dateStr : yearStr;

    if (convertStr != null && convertStr.length > 0 && convertStr !== '0') {
        const count = (convertStr.match(/\//g) || []).length;

        if (count === 0) {
            let date = new Date();
            date.setFullYear(parseInt(convertStr));
            return date;
        } else if (count === 1) {
            let dateParts: string[] = convertStr.split('/');
            return new Date(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1);
        }

        let dateParts: string[] = convertStr.split('/');
        return new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
    }
    return null;
}

export function dateFromTime(time: number): Date {
    let date = new Date();
    date.setTime(time);
    return date;
}

export interface Marker {
    dateStart?: string;
    yearFrom?: string;
    dateEnd?: string;
    yearTo?: string;
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

export interface ProcessedMarker {
    dateStart?: Date;
    yearFrom?: Date;
    dateEnd?: Date;
    yearTo?: Date;
}

export function getMinYear(markers: ProcessedMarker[]): number {
    let minYear = new Date().getFullYear();

    markers.forEach(marker => {
        if (marker.dateStart != null && marker.dateStart.getFullYear() < minYear) {
            minYear = marker.dateStart.getFullYear();
        }
    });

    return minYear;
}

export function getMaxYear(markers: ProcessedMarker[]): number {
    const todayYear = new Date();
    let maxYear = 0;

    markers.forEach(marker => {
        let dateEnd = marker.dateEnd;

        if (dateEnd === null) {
            dateEnd = todayYear;
        }

        if (dateEnd != null && dateEnd.getFullYear() > maxYear) {
            maxYear = dateEnd.getFullYear();
        }
    });

    return maxYear;
}
