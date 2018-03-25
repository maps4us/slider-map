import MarkerClusterer from 'node-js-marker-clusterer';
import * as peopleHelper from './people';

const _imagePath = {
    imagePath:
  'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 10
};

let _google = null;
let _map = null;
let _bounds = null;
let _markerClusterer = null;
let _infoWindow = null;

export function createMap(google, mapControlId) {
    _google = google;

    _map = new _google.maps.Map(document.getElementById(mapControlId), {
        zoom: 3,
        center: {
            lat: -28.024,
            lng: 140.887
        }
    });
}

export function createClusterer(people) {
    _markerClusterer = new MarkerClusterer(_map, getMarkers(people), _imagePath);
    _map.fitBounds(_bounds);
}

export function updateClusterer(people, yearStart, yearEnd) {
    _markerClusterer.clearMarkers();
    _markerClusterer = new MarkerClusterer(_map, getFilteredMarkers(people, yearStart, yearEnd), _imagePath);
    _map.fitBounds(_bounds);
}

function getFilteredMarkers(people, yearStart, yearEnd) {
    return getMarkers(peopleHelper.filterPeople(people, yearStart, yearEnd));
}

function getMarkers(people) {
    let markers = [];
    _bounds = new _google.maps.LatLngBounds();

    people.forEach(person => {
        const marker = getMarkerForPerson(person);
        const content = peopleHelper.getContentString(person);

        _bounds.extend(marker.position);
        marker.addListener('click', () => openInfoWindow(content, marker));

        markers.push(marker);
    });

    return markers;
}

function openInfoWindow(content, marker) {
    if (_infoWindow != null) {
        _infoWindow.close();
    }
    _infoWindow = new _google.maps.InfoWindow({
        content: content
    });
    _infoWindow.open(_map, marker);
}

function getMarkerForPerson(person) {
    return new _google.maps.Marker({
        position: {
            lat: peopleHelper.getLatForPerson(person),
            lng: peopleHelper.getLongForPerson(person)
        },
        title: person.name
    });
}
