export enum DateMode {
    NO_DATES = -1,
    YEAR_DATES,
    YEAR_MONTH_DATES,
    YEAR_MONTH_DAY_DATES,
}

export function getDateModeFromString(date: string | undefined): DateMode {
    let dateMode: DateMode = DateMode.NO_DATES;

    if (date !== undefined && date !== '' && date !== '0') {
        dateMode = (date.match(/\//g) || []).length;
    }

    return dateMode;
}
