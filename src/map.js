import MarkerClusterer from 'node-js-marker-clusterer';
import * as peopleHelper from './people';
// import OverlappingMarkerSpiderfier from './oms.min';

const _clusterOptions = {
    imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 10,
    maxZoom: 15
};

let _google = null;
let _map = null;
let _bounds = null;
let _markerClusterer = null;
let _infoWindow = null;
// let _oms = null;

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
    _markerClusterer = new MarkerClusterer(_map, getMarkers(people), _clusterOptions);
    _map.fitBounds(_bounds);
}

export function updateClusterer(people) {
    _markerClusterer.clearMarkers();
    _markerClusterer = new MarkerClusterer(_map, getFilteredMarkers(people, yearStart, yearEnd), _clusterOptions);
    _map.fitBounds(_bounds);
}

export function panTo(position) {
    _map.panTo(position);
}

function getMarkers(people) {
    let markers = [];
    _bounds = new _google.maps.LatLngBounds();
    // overlappingMarker();

    people.forEach(person => {
        const marker = getMarkerForPerson(person);

        const content = `<img src="http://216.92.159.135/tkfgen.png"><b> ${person.name}</b>` +
            `<br>${person.displayLocation}<br>${person.yearRange}`;
        _bounds.extend(marker.position);
        marker.addListener('click', () => openInfoWindow(content, marker));
        // _oms.addListener('click', () => openInfoWindow(content, marker));
        // _oms.addMarker(marker);

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

// function overlappingMarker() {
//     if (_oms == null) {
//         _oms = new OverlappingMarkerSpiderfier(_map,
//             {markersWontMove: true, markersWontHide: true});
//     }
// }

function getMarkerForPerson(person) {
    return new _google.maps.Marker({
        position: person,
        title: person.name
    });
}
