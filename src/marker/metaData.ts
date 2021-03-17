import Marker from './marker';
import {DateMode, getDateModeFromString} from '../date/dateMode';

export enum MarkerType {
    DATE,
    NUMBER,
}

export class MetaData {
    public pin: string;
    public icon: string;
    public publishedDate: string;
    public title: string;
    public markerType: MarkerType;
    public hasData: boolean;
    public dateMode: DateMode;
    public min: Date | number;
    public max: Date | number;
    public viewCount?: number;
    public singleHandle: boolean;

    public init(markers: Marker[]): void {
        if (this.markerType == MarkerType.DATE) {
            this.dateMode = this.getDateMode(markers);
            this.hasData = this.dateMode !== DateMode.NO_DATES;
            this.min = this.getMinDate(markers);
            this.max = this.getMaxDate(markers);
        } else {
            this.hasData = this.hasNumberData(markers);
            this.min = this.getMinNumber(markers);
            this.max = this.getMaxNumber(markers);
        }
    }

    private hasNumberData(markers: Marker[]): boolean {
        return markers.some((marker) => {
            if (marker.originalData.range?.end || marker.originalData.range?.start) {
                return true;
            } else if (marker.originalData.value) {
                return true;
            }

            return false;
        });
    }

    private getDateMode(markers: Marker[]): DateMode {
        let dateMode: DateMode = DateMode.NO_DATES;

        markers.forEach((marker) => {
            if (marker.originalData.range?.end || marker.originalData.range?.start) {
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
            .filter((marker) => marker.data.value || marker.data.range?.start)
            .map((marker) => {
                if (marker.data.range?.start) {
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
            .filter((marker) => marker.data.value || marker.data.range?.end)
            .map((marker) => {
                if (marker.data.range?.end) {
                    return marker.data.range.end;
                }
                return marker.data.value;
            });

        if (dates.length > 0) {
            return dates.reduce((p, v) => (p && v && p > v ? p : v)) as Date;
        }

        return new Date();
    }

    private getMinNumber(markers: Marker[]): number {
        const numbers = markers
            .filter((marker) => marker.data.value || marker.data.range?.start)
            .map((marker) => {
                if (marker.data.range?.start) {
                    return marker.data.range.start;
                }
                return marker.data.value;
            });

        if (numbers.length > 0) {
            return numbers.reduce((p, v) => (p && v && p < v ? p : v)) as number;
        }

        return -1;
    }

    private getMaxNumber(markers: Marker[]): number {
        const numbers = markers
            .filter((marker) => marker.data.value || marker.data.range?.end)
            .map((marker) => {
                if (marker.data.range?.end) {
                    return marker.data.range.end;
                }
                return marker.data.value;
            });

        if (numbers.length > 0) {
            return numbers.reduce((p, v) => (p && v && p > v ? p : v)) as number;
        }

        return -1;
    }
}
