import {dateFromString} from '../date/conversion';
import {createPin} from '../map/pin';
import {MarkerType, MetaData} from './metaData';
import {dateFromTime} from '../date/conversion';

interface Link {
    title: string;
    url: string;
}

interface Location {
    city: string;
    country: string;
    lat: string;
    long: string;
    state: string;
}

interface Data {
    value?: Value;
    range?: Range;
}

interface Range {
    start?: Value;
    end?: Value;
}

type Value = string | Date | number;

export class Marker {
    public name: string;
    public addInfo: string;
    public icon: string;
    public pin: string | google.maps.Icon;
    public link: Link;
    public location: Location;

    public data: Data;
    public originalData: Data;

    public displayLocation: string;
    public displayData?: string;
    public lat: number;
    public lng: number;

    public async init(isValDate: boolean): Promise<void> {
        this.displayLocation = this.getDisplayLocation(this);
        this.displayData = this.getDisplayValue(this, isValDate);

        if (this.data.value) {
            this.originalData = {value: this.data.value};
            this.data.value = isValDate
                ? parseInt(this.data.value as string)
                : dateFromString(this.data.value as string);
        } else if (this.data.range) {
            this.originalData = {range: {start: this.data.range.start, end: this.data.range.end}};
            this.data.range.start = isValDate
                ? parseInt(this.data.range.start as string)
                : dateFromString(this.data.range.start as string);
            this.data.range.end = isValDate
                ? parseInt(this.data.range.end as string)
                : dateFromString(this.data.range.end as string);
        }

        this.lat = parseFloat(this.location.lat);
        this.lng = parseFloat(this.location.long);

        if (typeof this.pin === 'string' && this.pin.length > 0) {
            const pin = await createPin(this.pin);
            if (pin.anchor?.x !== 0) {
                this.pin = pin;
            } else {
                this.pin = '';
            }
        }
    }

    public isInRange(values: number[], metaData: MetaData): boolean {
        if (metaData.markerType == MarkerType.NUMBER) {
            if (values.length === 1) {
                if (this.data.value) {
                    return (this.data.value as number) === values[0];
                } else if (this.data.range) {
                    const start = this.data.range.start ? this.data.range.start : metaData.min;
                    const end = this.data.range.end ? this.data.range.end : metaData.max;
                    return start <= values[0] && values[0] <= end;
                }
                return true;
            }
            const start = values[0];
            const end = values[1];

            if (this.data.value) {
                return (this.data.value as number) <= end && this.data.value >= start;
            } else if (this.data.range) {
                const start = this.data.range.start ? this.data.range.start : metaData.min;
                const end = this.data.range.end ? this.data.range.end : metaData.max;
                return start <= end && end >= start;
            }
            return true;
        } else {
            if (values.length === 1) {
                const date = dateFromTime(values[0]);

                if (this.data.value) {
                    return (this.data.value as Date) === date;
                } else if (this.data.range) {
                    const start = this.data.range.start ? this.data.range.start : metaData.min;
                    const end = this.data.range.end ? this.data.range.end : metaData.max;
                    return start <= date && date <= end;
                }
                return true;
            }
            const dateStart = dateFromTime(values[0]);
            const dateEnd = dateFromTime(values[1]);

            if (this.data.value) {
                return (this.data.value as Date) <= dateEnd && this.data.value >= dateStart;
            } else if (this.data.range) {
                const start = this.data.range.start ? this.data.range.start : metaData.min;
                const end = this.data.range.end ? this.data.range.end : metaData.max;
                return start <= dateEnd && end >= dateStart;
            }
            return true;
        }
    }

    private getDisplayLocation(marker: Marker): string {
        let displayLocation = '';
        if (marker.location.state.length > 0) {
            displayLocation = `${marker.location.city}, ${marker.location.state}, ${marker.location.country}`;
        } else {
            displayLocation = `${marker.location.city}, ${marker.location.country}`;
        }

        return displayLocation;
    }

    private getDisplayValue(marker: Marker, isValDate: boolean): string | undefined {
        if (marker.data.range) {
            let end = marker.data.range.end;
            if (!end) {
                end = isValDate ? 'present' : '';
            }

            let start = marker.data.range.start;
            if (!start) {
                start = isValDate ? 'beginning' : '';
            }

            return `${start} - ${end}`;
        } else if (marker.data.value) {
            return `${marker.data.value}`;
        }

        return undefined;
    }
}
