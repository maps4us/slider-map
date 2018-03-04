import GoogleMapsLoader from 'google-maps';
import MarkerClusterer from 'node-js-marker-clusterer';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import axios from 'axios';
import "./style.css";

let _google = null;
let _infoWindow = null;
const _imagePath = {
    imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
};
let _mapId = null;
let _people = null;
let _mapControlId = 'timeLineMapControl';
let _dateControlId = 'timeLineDateControl';
let _bounds = null;
let _map = null;

export default function createMap() {
    processArguments(arguments);

    if (window.google !== undefined) {
        _google = window.google;

        createEverything();
    } else {
        GoogleMapsLoader.load(google => {
            _google = google;
            createEverything();
        });
    }
}

function processArguments(passedArguments) {
    _mapId = passedArguments[0];
    if (passedArguments.length === 3) {
        _mapControlId = passedArguments[1];
        _dateControlId = passedArguments[2];

        const mapControlDiv = document.getElementById(_mapControlId);
        mapControlDiv.className += ' map-control';

        const dateControlDiv = document.getElementById(_dateControlId);
        dateControlDiv.className += ' date-control';
    } else {
        const parentDivId = passedArguments[1];

        const controlDiv = document.getElementById(parentDivId);

        const mapControlDiv = document.createElement('div');
        mapControlDiv.id = _mapControlId;
        mapControlDiv.className = 'map-control';
        controlDiv.appendChild(mapControlDiv);

        const dateControlDiv = document.createElement('div');
        dateControlDiv.id = _dateControlId;
        dateControlDiv.className = 'date-control';
        controlDiv.appendChild(dateControlDiv);
    }

    if (document.getElementById(_mapControlId).offsetHeight === 0) {
        document.getElementById(_mapControlId).style.height = '400px';
    }
}

function createEverything() {
    axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${_mapId}.json`).then(response => {
        _people = response.data.persons;
        const todayYear = new Date().getFullYear();
        const minYear = getMinYear(response, todayYear);
        const maxYear = getMaxYear(response, todayYear);

        _map = createGMap();
        let slider = createSlider(minYear, maxYear);

        let markerClusterer = new MarkerClusterer(_map, getMarkers(_people), _imagePath);

        _map.fitBounds(_bounds);

        slider.noUiSlider.on('set', ([yearStart, yearEnd]) => {
            markerClusterer.clearMarkers();
            markerClusterer = new MarkerClusterer(_map, getFilteredMarkers(yearStart, yearEnd), _imagePath);
            _map.fitBounds(_bounds);
        });
    });
}

function createSlider(minYear, maxYear) {
    let slider = document.getElementById(_dateControlId);

    noUiSlider.create(slider, {
        start: [minYear, maxYear],
        connect: true,
        range: {
            min: minYear,
            max: maxYear
        },
        pips: {
            mode: 'positions',
            values: [0, 25, 50, 75, 100],
            density: 4
        }
    });

    return slider;
}

function createGMap() {
    return new _google.maps.Map(document.getElementById(_mapControlId), {
        zoom: 3,
        center: {
            lat: -28.024,
            lng: 140.887
        }
    });
}

function getFilteredMarkers(yearStart, yearEnd) {
    return getMarkers(filterPeople(yearStart, yearEnd));
}

function getMarkers(people) {
    let markers = [];
    _bounds = new _google.maps.LatLngBounds();

    people.forEach(person => {
        const marker = getMarkerForPerson(person);
        const content = getContentString(person);

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
    let lat = parseFloat(person.lat);
    if (isNaN(lat) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('lat')) {
        lat = parseFloat(person.generated.lat);
    }

    let lng = parseFloat(person.long);
    if (isNaN(lng) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('long')) {
        lng = parseFloat(person.generated.long);
    }

    return new _google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        title: person.name
    });
}

function getContentString(person) {
    let displayLocation = '';
    if (person.hasOwnProperty('generated') && person.generated.hasOwnProperty('location')) {
        displayLocation = person.generated.location;
    } else if (person.state.length > 0) {
        displayLocation = `${person.city}, ${person.state}, ${person.country}`;
    } else {
        displayLocation = `${person.city}, ${person.country}`;
    }
    return `<img src="http://216.92.159.135/tkfgen.png"><b> ${person.name}</b>
      <br>${displayLocation}<br>${person.yearFrom} - ${person.yearTo}`;
}

function filterPeople(yearStart, yearEnd) {
    return _people.filter(person => {
        return person.yearFrom <= yearEnd && person.yearTo >= yearStart;
    });
}

function getMinYear(response, todayYear) {
    let minYear = todayYear;

    response.data.persons.forEach(person => {
        const from = parseInt(person.yearFrom);
        if (from < minYear) {
            minYear = from;
        }
    });

    return minYear;
}

function getMaxYear(response, todayYear) {
    let maxYear = 0;

    response.data.persons.forEach(person => {
        let to = parseInt(person.yearTo);

        if (to === undefined || to <= 0) {
            to = todayYear;
        }

        if (to > maxYear) {
            maxYear = to;
        }
    });

    return maxYear;
}
