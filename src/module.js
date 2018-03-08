import GoogleMapsLoader from 'google-maps';
import axios from 'axios';
import * as peopleHelper from './people';
import { createSlider } from './slider';
import * as mapHelper from './map';
import "./style.css";

let _google = null;
let _mapId = null;
let _people = null;
let _mapControlId = 'timeLineMapControl';
let _dateControlId = 'timeLineDateControl';

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

function createTimeLineMap() {
    axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${_mapId}.json`).then(response => {
        _people = response.data.persons;
        const minYear = peopleHelper.getMinYear(_people);
        const maxYear = peopleHelper.getMaxYear(_people);

        mapHelper.createMap(_google, _mapControlId);

        mapHelper.createClusterer(_people);

        createSlider(_dateControlId, minYear, maxYear, ([yearStart, yearEnd]) =>
          mapHelper.updateClusterer(_people, yearStart, yearEnd));
    });
}
