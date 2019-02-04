export const NO_DATES = -1;
export const YEAR_DATES = 0;
export const YEAR_MONTH_DATES = 1;
export const YEAR_MONTH_DAY_DATES = 2;

export function formatDate(date, mode) {
    if (mode === YEAR_DATES) {
        return date.getFullYear();
    } else if (mode === YEAR_MONTH_DATES) {
        return date.getMonth() + "/" +
            date.getFullYear();
    } else if (mode === YEAR_MONTH_DAY_DATES) {
        return date.getDay() + "/" +
                date.getMonth() + "/" +
                date.getFullYear();
    }

    return "";
}

export function formatStrDate(val, mode) {
    const date = new Date(val.toString());

    return formatDate(date, mode);
}

export function createDate(yearStr, dateStr) {
    const convertStr = dateStr != null ? dateStr : yearStr;

    if (convertStr != null && convertStr.length > 0) {
        return new Date(convertStr);
    }
    return null;

}

export function getDateRange(marker, dateMode) {
    let dateEnd = "";
    if (marker.dateEnd == null) {
        dateEnd = 'present';
    } else {
        dateEnd = formatDate(marker.dateEnd, dateMode);
    }

    let dateStart = formatDate(marker.dateStart, dateMode);

    return `${dateStart} - ${dateEnd}`;
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
            count = countEnd > count ? countEnd : count;
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
