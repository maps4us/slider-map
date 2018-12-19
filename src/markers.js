let _minYear = -1;
let _maxYear = -1;
export function parseMarkers(markers) {
    _minYear = -1;
    _maxYear = -1;
    return markers.map(marker => {
        marker.displayLocation = getDisplayLocation(marker);
        marker.yearRange = getYearRange(marker);
        marker.lat = getLatForMarker(marker);
        marker.lng = getLongForMarker(marker);
        return marker;
    });
}

export function filterMarkers(markers, yearStart, yearEnd) {
    return markers.filter(marker => {
        const from = parseInt(marker.yearFrom);
        if (from === undefined || from <= 0) {
            to = getMinYear(markers);
        }

        let to = parseInt(marker.yearTo);
        if (to === undefined || to <= 0) {
            to = getMaxYear(markers);
        }
        return from <= yearEnd && to >= yearStart;
    });
}

export function getMinYear(markers) {
    if (_minYear == -1) {
        _minYear = new Date().getFullYear();

        markers.forEach(marker => {
            const from = parseInt(marker.yearFrom);
            if (from < _minYear) {
                _minYear = from;
            }
        });
    }
    return _minYear;
}

export function getMaxYear(markers) {
    if (_maxYear == -1) {
        const todayYear = new Date().getFullYear();;
        _maxYear = 0;

        markers.forEach(marker => {
            let to = parseInt(marker.yearTo);

            if (to === undefined || to <= 0) {
                to = todayYear;
            }

            if (to > _maxYear) {
                _maxYear = to;
            }
        });
    }
    return _maxYear;
}

export function hasYears(markers) {
    return markers.some(marker => {
        const from = parseInt(marker.yearFrom);
        if (from !== undefined || from > 0) {
            return true;
        }

        let to = parseInt(marker.yearTo);
        if (to !== undefined || to > 0) {
            return true;
        }

        return false;
    });
}

function getDisplayLocation(marker) {
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

function getYearRange(marker) {
    const todayYear = new Date().getFullYear().toString;
    let endYear = marker.yearTo;
    if (endYear === todayYear || isNaN(endYear) || endYear === undefined || endYear <= 0) {
        endYear = 'present';
    }
    return `${marker.yearFrom} - ${endYear}`;
}

function getLatForMarker(marker) {
    let lat = parseFloat(marker.lat);
    if (isNaN(lat) && marker.hasOwnProperty('generated') && marker.generated.hasOwnProperty('lat')) {
        lat = parseFloat(marker.generated.lat);
    }

    return lat;

}

function getLongForMarker(marker) {
    let lng = parseFloat(marker.long);
    if (isNaN(lng) && marker.hasOwnProperty('generated') && marker.generated.hasOwnProperty('long')) {
        lng = parseFloat(marker.generated.long);
    }

    return lng;
}
