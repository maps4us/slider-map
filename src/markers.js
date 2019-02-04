import { createDate, getDateRange, getDateMode, getMinYear, getMaxYear, NO_DATES } from './date';

export default class Markers {
    constructor(markers) {
        this._dateMode = getDateMode(markers);

        this._markers = markers.map(marker => {
            marker.displayLocation = this._getDisplayLocation(marker);
            marker.dateStart = createDate(marker.yearFrom, marker.dateStart);
            marker.dateEnd = createDate(marker.yearTo, marker.dateEnd);
            marker.dateRange = this.hasDates() ? getDateRange(marker, this._dateMode) : null;
            marker.lat = this._getLatForMarker(marker);
            marker.lng = this._getLongForMarker(marker);
            return marker;
        });

        this._minYear = getMinYear(this._markers);
        this._maxYear = getMaxYear(this._markers);
    }

    getMarkers() {
        return this._markers;
    }

    hasDates() {
        return this._dateMode !== NO_DATES;
    }

    filter(dateStartVal, dateEndVal) {
        const dateStart = new Date(parseInt(dateStartVal).toString());
        const dateEnd = new Date(parseInt(dateEndVal).toString());

        return this._markers.filter(marker => {
            const start = marker.dateStart;
            if (start === null) {
                start = this._createDate(this._minYear());
            }

            let end = marker.dateEnd;
            if (end === null) {
                end = this._createDate(this._maxYear());
            }
            return start <= dateEnd && end >= dateStart;
        });
    }

    getMinYear() {
        return this._minYear;
    }

    getMaxYear() {
        return this._maxYear;
    }

    getDateMode() {
        return this._dateMode;
    }

    _getDisplayLocation(marker) {
        let displayLocation = '';
        if (marker.hasOwnProperty('generated') && marker.generated.hasOwnProperty('location')) {
            displayLocation = marker.generated.location;
        } else if (marker.state.length > 0) {
            displayLocation = `${marker.city}, ${marker.state}, ${marker.country}`;
        } else {
            displayLocation = `${marker.city}, ${marker.country}`;
        }

        return displayLocation;
    }

    _getLatForMarker(marker) {
        let lat = parseFloat(marker.lat);
        if (isNaN(lat) && marker.hasOwnProperty('generated') && marker.generated.hasOwnProperty('lat')) {
            lat = parseFloat(marker.generated.lat);
        }

        return lat;

    }

    _getLongForMarker(marker) {
        let lng = parseFloat(marker.long);
        if (isNaN(lng) && marker.hasOwnProperty('generated') && marker.generated.hasOwnProperty('long')) {
            lng = parseFloat(marker.generated.long);
        }

        return lng;
    }

}
