import {Marker} from './marker';
import {DateMode, getDateModeFromString} from '../date/dateMode';

export class MetaData {
    public pin: string;
    public icon: string;
    public publishedDate: string;
    public title: string;
    public hasDates: boolean;
    public dateMode: DateMode;
    public minDate: Date;
    public maxDate: Date;
    public viewCount?: number;
    public singleHandle: boolean;

    public init(markers: Marker[]): void {
        this.dateMode = this.getDateMode(markers);
        this.hasDates = this.dateMode !== DateMode.NO_DATES;
        this.minDate = this.getMinDate(markers);
        this.maxDate = this.getMaxDate(markers);
    }

    private getDateMode(markers: Marker[]): DateMode {
        let dateMode: DateMode = DateMode.NO_DATES;

        markers.forEach(marker => {
            if (marker.originalData.range) {
                const start = getDateModeFromString(marker.originalData.range.start as string | undefined);
                const end = getDateModeFromString(marker.originalData.range.end as string | undefined);
                dateMode = Math.max(start, end, dateMode);
            } else if (marker.originalData.value) {
                dateMode = getDateModeFromString(marker.originalData.value as string | undefined);
            }

            if (dateMode === DateMode.YEAR_MONTH_DAY_DATES) {
                return;
            }
        });

        return dateMode;
    }

    private getMinDate(markers: Marker[]): Date {
        const dates = markers
            .filter(marker => marker.data.value || marker.data.range)
            .map(marker => {
                if (marker.data.range) {
                    return marker.data.range.start;
                }
                return marker.data.value;
            });

        if (dates.length > 0) {
            return dates.reduce((p, v) => (p && v && p < v ? p : v)) as Date;
        }

        return new Date();
    }

    private getMaxDate(markers: Marker[]): Date {
        const dates = markers
            .filter(marker => marker.data.value || marker.data.range)
            .map(marker => {
                if (marker.data.range) {
                    return marker.data.range.end;
                }
                return marker.data.value;
            });

        if (dates.length > 0) {
            return dates.reduce((p, v) => (p && v && p > v ? p : v)) as Date;
        }

        return new Date();
    }
}
