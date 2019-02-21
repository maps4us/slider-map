import {createDate, getDateMode, getMinYear, getMaxYear, hasDates, dateFromTime} from './date';

export default class Markers {
    constructor(markers) {
        this._dateMode = getDateMode(markers);

        this._markers = markers.map(marker => {
            marker.displayLocation = this._getDisplayLocation(marker);
            marker.dateRange = this.hasDates() ? this._getDateRange(marker) : null;
            marker.dateStart = createDate(marker.yearFrom, marker.dateStart);
            marker.dateEnd = createDate(marker.yearTo, marker.dateEnd);
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
        return hasDates(this._dateMode);
    }

    filter(dateStartVal, dateEndVal) {
        const dateStart = dateFromTime(dateStartVal);
        const dateEnd = dateFromTime(dateEndVal);

        return this._markers.filter(marker => {
            const start = marker.dateStart ? marker.dateStart : this.getMinYear();
            const end = marker.dateEnd ? marker.dateEnd : this.getMaxYear();
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

    _getDateRange(marker) {
        let dateEnd = marker.dateEnd ? marker.dateEnd : marker.yearTo;
        if (dateEnd == null || dateEnd === '0' || dateEnd === 0) {
            dateEnd = 'present';
        }

        let dateStart = marker.dateStart ? marker.dateStart : marker.yearFrom;
        if (dateStart == null || dateStart === '0' || dateStart === 0) {
            dateStart = 'beginning';
        }

        return `${dateStart} - ${dateEnd}`;
    }
}
