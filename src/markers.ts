import * as date from './date';

interface Generated {
    location?: string;
    lat?: string;
    long?: string;
}

interface Website {
    title: string;
    url: string;
}

export interface Marker {
    dateStart?: string;
    yearFrom?: string;
    dateEnd?: string;
    yearTo?: string;
    lat: string;
    long: string;
    city: string;
    state: string;
    country: string;
    generated?: Generated;

    addInfo: string;
    icon: string;
    name: string;
    website: Website;
}

export interface ProcessedMarker {
    displayLocation: string;
    dateRange?: string;
    dateStart?: Date;
    yearFrom?: Date;
    dateEnd?: Date;
    yearTo?: Date;
    lat: number;
    lng: number;

    addInfo: string;
    icon: string;
    name: string;
    website: Website;
}

export default class Markers {
    private dateMode: date.DateMode;
    private markers: ProcessedMarker[];
    private minYear: Date;
    private maxYear: Date;

    public constructor(markers: Marker[]) {
        this.dateMode = date.getDateMode(markers);

        this.markers = markers.map(marker => {
            let processedMarker: ProcessedMarker = {
                name: marker.name,
                icon: marker.icon,
                addInfo: marker.addInfo,
                website: marker.website,
                displayLocation: this.getDisplayLocation(marker),
                dateRange: this.hasDates() ? this.getDateRange(marker) : undefined,
                dateStart: date.createDate(marker.yearFrom, marker.dateStart) as Date | undefined,
                dateEnd: date.createDate(marker.yearTo, marker.dateEnd) as Date | undefined,
                lat: this.getLatForMarker(marker),
                lng: this.getLongForMarker(marker)
            };

            return processedMarker;
        });

        this.minYear = date.getMinYear(this.markers);
        this.maxYear = date.getMaxYear(this.markers);
    }

    public getMarkers(): ProcessedMarker[] {
        return this.markers;
    }

    public hasDates(): boolean {
        return date.hasDates(this.dateMode);
    }

    public filter(dateStartVal: number, dateEndVal: number): ProcessedMarker[] {
        const dateStart = date.dateFromTime(dateStartVal);
        const dateEnd = date.dateFromTime(dateEndVal);

        return this.markers.filter(marker => {
            const start = marker.dateStart ? marker.dateStart : this.getMinYear();
            const end = marker.dateEnd ? marker.dateEnd : this.getMaxYear();
            return start <= dateEnd && end >= dateStart;
        });
    }

    public getMinYear(): Date {
        return this.minYear;
    }

    public getMaxYear(): Date {
        return this.maxYear;
    }

    public getDateMode(): date.DateMode {
        return this.dateMode;
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

        if (marker.lat.length > 0) {
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
        if (dateEnd == null || dateEnd === '0') {
            // || dateEnd === 0) {
            dateEnd = 'present';
        }

        let dateStart = marker.dateStart ? marker.dateStart : marker.yearFrom;
        if (dateStart == null || dateStart === '0') {
            // || dateStart === 0) {
            dateStart = 'beginning';
        }

        return `${dateStart} - ${dateEnd}`;
    }
}
