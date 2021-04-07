import Marker from '../src/marker/marker';
import {dateFromString} from '../src/date/conversion';

export function createEmptyMarker(): Marker {
    const marker = {
        lat: 1,
        lng: 1,
        location: {
            lat: '',
            long: '',
            city: '',
            state: '',
            country: '',
        },
        data: {},
        originalData: {},
        addInfo: '',
        icon: '',
        name: '',
        link: {
            title: '',
            url: '',
        },

        displayLocation: '',
    };

    return Object.assign({}, marker) as Marker;
}

export function markerWithRange(start: string | number, end: string | number): Marker {
    const marker: Marker = createEmptyMarker();
    if (typeof start === 'string' && typeof end === 'string') {
        marker.data.range = {
            start: dateFromString(start),
            end: dateFromString(end),
        };
    } else {
        marker.data.range = {
            start: start,
            end: end,
        };
    }

    marker.originalData = {};
    marker.originalData.range = {
        start: start,
        end: end,
    };

    return marker;
}

export function markerWithValue(val: string | number): Marker {
    const marker: Marker = createEmptyMarker();

    if (typeof val === 'string') {
        marker.data.value = dateFromString(val);
    } else {
        marker.data.value = val;
    }
    marker.originalData = {};
    marker.originalData.value = val;

    return marker;
}
