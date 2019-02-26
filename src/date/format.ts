import {DateMode} from './markers';

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
