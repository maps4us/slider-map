import MarkerClusterer from 'node-js-marker-clusterer';

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
let _icon = 'https://image.ibb.co/cf584S/favicon.png';
let _gmarkers = [];

export function createMap(google, mapControlId, icon) {
    _google = google;

    _map = new _google.maps.Map(document.getElementById(mapControlId), {
        zoom: 3,
        center: {
            lat: -28.024,
            lng: 140.887
        }
    });

    if (icon && icon.length) {
        _icon = icon;
    }
}

export function createClusterer(markers) {
    _markerClusterer = new MarkerClusterer(_map, getGMarkers(markers), _clusterOptions);
    _map.fitBounds(_bounds);
}

export function updateClusterer(markers) {
    _markerClusterer.clearMarkers();
    _markerClusterer = new MarkerClusterer(_map, getGMarkers(markers), _clusterOptions);
    _map.fitBounds(_bounds);
}

export function panTo(position) {
    _map.panTo(position);

    const marker = _gmarkers.find(marker => marker.title === position.name &&
      marker.getPosition().lat() === position.lat);

    _map.setZoom(_clusterOptions.maxZoom);
    _google.maps.event.trigger(marker, 'click');
}

function getGMarkers(markers) {
    _gmarkers = [];
    _bounds = new _google.maps.LatLngBounds();

    markers.forEach(marker => {
        const gmarker = new _google.maps.Marker({
            position: marker,
            title: marker.name
        });

        const icon = marker.icon ? marker.icon : _icon;
        let website = marker.website;

        if (website && typeof website === 'string') {
            website = { url: marker.website, title: 'website'};
        }

        const content = `<img src="${icon}" width="32" height="32"><b> ${marker.name}</b>` +
            `<br>${marker.displayLocation}<br>${marker.yearRange}` +
            `${marker.addInfo ? `<br>${marker.addInfo}` : ``}` +
            `${website ? `<br><a href="${website.url}" target="_blank">${website.title}</a>` : ``}`;

        _bounds.extend(gmarker.position);
        gmarker.addListener('click', () => openInfoWindow(content, gmarker));

        _gmarkers.push(gmarker);
    });

    return _gmarkers;
}

function openInfoWindow(content, gmarker) {
    if (_infoWindow != null) {
        _infoWindow.close();
    }
    _infoWindow = new _google.maps.InfoWindow({
        content: content
    });
    _infoWindow.open(_map, gmarker);
}
