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

export interface Marker {
    dateStart?: string;
    yearFrom?: string;
    dateEnd?: string;
    yearTo?: string;
    lat: string | number;
    long: string;
    lng: number;
    city: string;
    state: string;
    country: string;
    generated?: Generated;

    addInfo: string;
    icon: string;
    name: string;
    website: Website;

    dateRange: DateRange;
    displayLocation: string;
}

export class Markers {
    private markers: Marker[];

    public constructor(markers: Marker[]) {
        this.markers = markers.map(marker => {
            // let marker = Object.assign(new Marker(), markerJsonObj);

            marker.displayLocation = this.getDisplayLocation(marker);
            let dateRange: DateRange = {
                displayStr: ''
            };

            dateRange.displayStr = this.getDateRange(marker);

            let dateStartStr = marker.yearFrom ? marker.yearFrom : marker.dateStart;
            if (dateStartStr) {
                dateRange.start = dateFromString(dateStartStr);
            }
            let dateEndStr = marker.yearTo ? marker.yearTo : marker.dateEnd;
            if (dateEndStr) {
                dateRange.end = dateFromString(dateEndStr);
            }

            marker.dateRange = dateRange;

            marker.lat = this.getLatForMarker(marker);
            marker.lng = this.getLongForMarker(marker);

            return marker;
        });
    }

    public getMarkers(): Marker[] {
        return this.markers;
    }

    public filter(dateStartVal: number, dateEndVal: number, metaData: MetaData): Marker[] {
        const dateStart = dateFromTime(dateStartVal);
        const dateEnd = dateFromTime(dateEndVal);

        return this.markers.filter(marker => {
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
