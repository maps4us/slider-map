import GoogleMapsLoader from 'google-maps';
import axios from 'axios';
import * as peopleHelper from './people';
import * as domHelper from './dom';
import { createSlider } from './slider';
import * as mapHelper from './map';
import "./style.css";

let _google = null;
let _mapId = null;
let _people = null;
let _mapControlId = 'timeLineMapControl';
let _dateControlId = 'timeLineDateControl';
let _listeners = {};

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

    select(person) {
        mapHelper.panTo(person);
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

function createTimeLineMap() {
    axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${_mapId}.json`).then(response => {
        _people = peopleHelper.parsePeople(response.data.persons);
        const minYear = peopleHelper.getMinYear(_people);
        const maxYear = peopleHelper.getMaxYear(_people);

        mapHelper.createMap(_google, _mapControlId);

        mapHelper.createClusterer(_people);
        update(_people);

        createSlider(_dateControlId, minYear, maxYear, ([yearStart, yearEnd]) => {
            const people = peopleHelper.filterPeople(_people, yearStart, yearEnd);
            mapHelper.updateClusterer(people);
            update(people);
        });
    });
}

function update(people) {
    if ('update' in _listeners) {
        _listeners['update'](people);
    }
}
