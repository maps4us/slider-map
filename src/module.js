import GoogleMapsLoader from 'google-maps';
import axios from 'axios';
import * as markerHelper from './markers';
import * as domHelper from './dom';
import { createSlider } from './slider';
import * as mapHelper from './map';
import "./style.css";

let _google = null;
let _mapId = null;
let _markers = null;
let _mapControlId = 'timeLineMapControl';
let _dateControlId = 'timeLineDateControl';
let _listeners = {};
let _metaData = {};

export default class TimeLineMap {
    constructor() {
        processArguments(arguments);
    }

    create() {
        if (window.google !== undefined) {
            _google = window.google;

            createTimeLineMap();
        } else {
            GoogleMapsLoader.load(google => {
                _google = google;
                createTimeLineMap();
            });
        }
    }

    addListener(type, cb) {
        _listeners[type] = cb;
    }

    select(marker) {
        mapHelper.panTo(marker);
    }
}

function processArguments(passedArguments) {
    _mapId = passedArguments[0];
    if (passedArguments.length === 3) {
        _mapControlId = passedArguments[1];
        _dateControlId = passedArguments[2];
        domHelper.addClasses(_mapControlId, _dateControlId);
    } else {
        const parentDivId = passedArguments[1];
        domHelper.createControlDivs(parentDivId, _mapControlId, _dateControlId);
    }

    domHelper.ensureMapHeight(_mapControlId);
}

async function createTimeLineMap() {
    const response = await axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${_mapId}.json`);
    _metaData = Object.assign({}, response.data);
    delete _metaData.markers;
    delete _metaData.persons;
    sendMetaData(_metaData);

    _markers = markerHelper.parseMarkers(response.data.markers ? response.data.markers : response.data.persons);
    const minYear = markerHelper.getMinYear(_markers);
    const maxYear = markerHelper.getMaxYear(_markers);

    await mapHelper.createMap(_google, _mapControlId, _metaData.icon, _metaData.pin);
    mapHelper.createClusterer(_markers);
    update(_markers);

    createSlider(_dateControlId, minYear, maxYear, ([yearStart, yearEnd]) => {
        const markers = markerHelper.filterMarkers(_markers, yearStart, yearEnd);
        mapHelper.updateClusterer(markers);
        update(markers);
    });
}

function update(markers) {
    if ('update' in _listeners) {
        _listeners['update'](markers);
    }
}

function sendMetaData(metaData) {
    if ('metaData' in _listeners) {
        _listeners['metaData'](metaData);
    }
}
