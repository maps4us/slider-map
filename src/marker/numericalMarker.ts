import {createPin} from '../map/pin';
import {MetaData} from './metaData';
import Marker from './marker';

export default class NumericalMarker extends Marker {
    public constructor() {
        super();
    }

    public async init(): Promise<void> {
        this.displayLocation = this.getDisplayLocation(this);
        this.displayData = this.getDisplayValue(this);

        if (this.data.value) {
            this.originalData = {value: this.data.value};
            this.data.value = parseInt(this.data.value as string);
        } else if (this.data.range?.end || this.data.range?.start) {
            this.originalData = {range: {start: this.data.range.start, end: this.data.range.end}};

            if (this.data.range?.start) {
                this.data.range.start = parseInt(this.data.range.start as string);
            }

            if (this.data.range?.end) {
                this.data.range.end = parseInt(this.data.range.end as string);
            }
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
        if (values.length === 1) {
            if (this.data.value) {
                return (this.data.value as number) === values[0];
            } else if (this.data.range?.end || this.data.range?.start) {
                const start = this.data.range.start ? this.data.range.start : metaData.min;
                const end = this.data.range.end ? this.data.range.end : metaData.max;
                return start <= values[0] && values[0] <= end;
            }
            return true;
        }

        if (this.data.value) {
            return (this.data.value as number) <= values[1] && this.data.value >= values[0];
        } else if (this.data.range?.end || this.data.range?.start) {
            const start = this.data.range.start ? this.data.range.start : metaData.min;
            const end = this.data.range.end ? this.data.range.end : metaData.max;
            return start <= values[1] && end >= values[0];
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
        if (marker.data.range?.end || marker.data.range?.start) {
            let end = marker.data.range.end;
            if (!end) {
                end = '';
            }

            let start = marker.data.range.start;
            if (!start) {
                start = '';
            }

            return `${start} - ${end}`;
        } else if (marker.data.value) {
            return `${marker.data.value}`;
        }

        return undefined;
    }
}
