import {dateFromString} from '../date/conversion';
import {createPin} from '../map/pin';
import {MetaData} from './metaData';
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

type Value = string | Date;

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

    public async init(): Promise<void> {
        this.displayLocation = this.getDisplayLocation(this);
        this.displayData = this.getDisplayValue(this);

        if (this.data.value) {
            this.originalData =  { value: this.data.value };
            this.data.value = dateFromString(this.data.value as string);
        } else if (this.data.range) {
            this.originalData = { range: { start: this.data.range.start, end: this.data.range.end }};
            this.data.range.start = dateFromString(this.data.range.start as string);
            this.data.range.end = dateFromString(this.data.range.end as string);
        }

        this.lat = parseFloat(this.location.lat);
        this.lng = parseFloat(this.location.long);

        if (typeof this.pin === 'string' && this.pin.length > 0) {
            const pin = await createPin(this.pin);
            if (pin.anchor && pin.anchor.x !== 0) {
                this.pin = pin;
            } else {
                this.pin = '';
            }
        }
    }

    public isInRange(dateStartVal: number, dateEndVal: number, metaData: MetaData): boolean {
        const dateStart = dateFromTime(dateStartVal);
        const dateEnd = dateFromTime(dateEndVal);

        if (this.data.value) {
            return (this.data.value as Date) <= dateEnd && this.data.value >= dateStart;
        } else if (this.data.range) {
            const start = this.data.range.start ? this.data.range.start : metaData.minDate;
            const end = this.data.range.end ? this.data.range.end : metaData.maxDate;
            return start <= dateEnd && end >= dateStart;
        }
        return true;
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

    private getDisplayValue(marker: Marker): string | undefined {
        if (marker.data.range) {
            let end = marker.data.range.end;
            if (!end) {
                end = 'present';
            }

            let start = marker.data.range.start;
            if (!start) {
                start = 'beginning';
            }

            return `${start} - ${end}`;
        } else if (marker.data.value) {
            return `${marker.data.value}`;
        }

        return undefined;
    }
}
