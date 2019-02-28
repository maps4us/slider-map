import {dateFromString, dateFromTime} from '../date/conversion';
import {MetaData} from './metaData';

interface Generated {
    location?: string;
    lat?: string;
    long?: string;
}

interface Website {
    title: string;
    url: string;
}

interface DateRange {
    displayStr: string;
    start?: Date;
    end?: Date;
}

export class Marker {
    public name: string;
    public addInfo: string;
    public icon: string;
    public website: Website;

    public lat: string | number;
    public long: string;
    public lng: number;
    public city: string;
    public state: string;
    public country: string;

    public dateStart?: string;
    public yearFrom?: string;
    public dateEnd?: string;
    public yearTo?: string;

    public generated?: Generated;

    public dateRange: DateRange;
    public displayLocation: string;

    public process(hasDates: boolean): void {
        this.displayLocation = this.getDisplayLocation(this);
        let dateRange: DateRange = {
            displayStr: ''
        };

        if (hasDates) {
            dateRange.displayStr = this.getDateRange(this);

            let dateStartStr = this.yearFrom ? this.yearFrom : this.dateStart;
            if (dateStartStr) {
                dateRange.start = dateFromString(dateStartStr);
            }
            let dateEndStr = this.yearTo ? this.yearTo : this.dateEnd;
            if (dateEndStr) {
                dateRange.end = dateFromString(dateEndStr);
            }

            this.dateRange = dateRange;
        }

        this.lat = this.getLatForMarker(this);
        this.lng = this.getLongForMarker(this);
    }

    public static filter(markers: Marker[], dateStartVal: number, dateEndVal: number, metaData: MetaData): Marker[] {
        const dateStart = dateFromTime(dateStartVal);
        const dateEnd = dateFromTime(dateEndVal);

        return markers.filter(marker => {
            if (marker.dateRange) {
                const start = marker.dateRange.start ? marker.dateRange.start : metaData.minDate;
                const end = marker.dateRange.end ? marker.dateRange.end : metaData.maxDate;
                return start <= dateEnd && end >= dateStart;
            }

            return true;
        });
    }

    private getDisplayLocation(marker: Marker): string {
        let displayLocation = '';
        if (marker.generated && marker.generated.location) {
            displayLocation = marker.generated.location;
        } else if (marker.state.length > 0) {
            displayLocation = `${marker.city}, ${marker.state}, ${marker.country}`;
        } else {
            displayLocation = `${marker.city}, ${marker.country}`;
        }

        return displayLocation;
    }

    private getLatForMarker(marker: Marker): number {
        let lat = 0;

        if (typeof marker.lat === 'string' && marker.lat.length > 0) {
            lat = parseFloat(marker.lat);
        } else if (marker.generated && marker.generated.lat) {
            lat = parseFloat(marker.generated.lat);
        }

        return lat;
    }

    private getLongForMarker(marker: Marker): number {
        let lng = 0;

        if (marker.long.length > 0) {
            lng = parseFloat(marker.long);
        } else if (marker.generated && marker.generated.long) {
            lng = parseFloat(marker.generated.long);
        }

        return lng;
    }

    private getDateRange(marker: Marker): string {
        let dateEnd = marker.dateEnd ? marker.dateEnd : marker.yearTo;
        if (dateEnd === undefined || dateEnd === '0') {
            dateEnd = 'present';
        }

        let dateStart = marker.dateStart ? marker.dateStart : marker.yearFrom;
        if (dateStart === undefined || dateStart === '0') {
            dateStart = 'beginning';
        }

        return `${dateStart} - ${dateEnd}`;
    }
}
