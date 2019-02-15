export const NO_DATES = -1;
export const YEAR_DATES = 0;
export const YEAR_MONTH_DATES = 1;
export const YEAR_MONTH_DAY_DATES = 2;

export function formatDate(date, mode) {
    if (mode === YEAR_DATES) {
        return date.getFullYear();
    } else if (mode === YEAR_MONTH_DATES) {
        return date.getMonth() + '/' + date.getFullYear();
    } else if (mode === YEAR_MONTH_DAY_DATES) {
        return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
    }

    return '';
}

export function createDate(yearStr, dateStr) {
    const convertStr = dateStr != null ? dateStr : yearStr;

    if (convertStr != null && convertStr.length > 0 && convertStr !== '0' && convertStr !== 0) {
        const count = (convertStr.match(/\//g) || []).length;

        if (count === 0) {
            let date = new Date();
            date.setFullYear(parseInt(convertStr));
            return date;
        } else if (count === 1) {
            let date = new Date();
            let dateParts = convertStr.split('/');

            date.setFullYear(parseInt(dateParts(1)));
            date.setFullYear(parseInt(dateParts(0) - 1));
            return date;
        }

        return new Date(convertStr);
    }
    return null;
}

export function dateFromTime(time) {
    let date = new Date();
    date.setTime(time);
    return date;
}

export function getDateMode(markers) {
    let dateMode = NO_DATES;

    markers.forEach(marker => {
        let count = 0;
        let dateStart = marker.dateStart ? marker.dateStart : marker.yearFrom;
        if (dateStart !== null && dateStart !== '') {
            count = (dateStart.match(/\//g) || []).length;
        }

        let dateEnd = marker.dateEnd ? marker.dateEnd : marker.yearTo;
        if (dateEnd !== null && dateEnd !== '') {
            const countEnd = (dateEnd.match(/\//g) || []).length;
            // check if bigger
            count = Math.max(count, countEnd);
        }

        if (count > dateMode) {
            dateMode = count;

            if (dateMode === YEAR_MONTH_DAY_DATES) {
                return;
            }
        }
    });

    return dateMode;
}

export function getMinYear(markers) {
    let minYear = new Date().getFullYear();

    markers.forEach(marker => {
        if (marker.dateStart != null && marker.dateStart.getFullYear() < minYear) {
            minYear = marker.dateStart.getFullYear();
        }
    });

    return minYear;
}

export function getMaxYear(markers) {
    const todayYear = new Date();
    let maxYear = 0;

    markers.forEach(marker => {
        let dateEnd = marker.dateEnd;

        if (dateEnd === null) {
            dateEnd = todayYear;
        }

        if (dateEnd.getFullYear() > maxYear) {
            maxYear = dateEnd.getFullYear();
        }
    });

    return maxYear;
}
