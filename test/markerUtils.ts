import {Marker} from '../src/marker/marker';
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
            country: ''
        },
        data: {},
        originalData: {},
        addInfo: '',
        icon: '',
        name: '',
        link: {
            title: '',
            url: ''
        },

        displayLocation: ''
    };

    return Object.assign(new Marker(), marker);
}

export function markerWithRange(start: string, end: string): Marker {
    let marker: Marker = createEmptyMarker();
    marker.data.range = {
        start: dateFromString(start),
        end: dateFromString(end)
    };

    marker.originalData.range = {
        start: start,
        end: end
    };

    return marker;
}

export function markerWithValue(val: string): Marker {
    let marker: Marker = createEmptyMarker();
    marker.data.value = dateFromString(val);
    marker.originalData.value = val;

    return marker;
}
