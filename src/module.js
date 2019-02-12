import GoogleMapsLoader from 'google-maps';
import axios from 'axios';
import Markers from './markers';
import * as domHelper from './dom';
import Slider from './slider';
import * as mapHelper from './map';
import './style.css';

export default class TimeLineMap {
    constructor() {
        this._google = null;
        this._mapId = null;
        this._markers = null;
        this._slider = null;
        this._mapControlId = 'timeLineMapControl';
        this._dateControlId = 'timeLineDateControl';
        this._listeners = {};
        this._metaData = {};

        this._processArguments(arguments);
    }

    create() {
        if (window.google !== undefined) {
            this._google = window.google;

            this._createTimeLineMap();
        } else {
            GoogleMapsLoader.load(google => {
                this._google = google;
                this._createTimeLineMap();
            });
        }
    }

    addListener(type, cb) {
        this._listeners[type] = cb;
    }

    select(marker) {
        mapHelper.panTo(marker);
    }

    _processArguments(passedArguments) {
        this._mapId = passedArguments[0];
        if (passedArguments.length === 3) {
            this._mapControlId = passedArguments[1];
            this._dateControlId = passedArguments[2];
            domHelper.addClasses(this._mapControlId, this._dateControlId);
        } else {
            const parentDivId = passedArguments[1];
            domHelper.createControlDivs(parentDivId, this._mapControlId, this._dateControlId);
        }

        domHelper.ensureMapHeight(this._mapControlId);
    }

    async _createTimeLineMap() {
        const response = await axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${this._mapId}.json`);
        this._metaData = Object.assign({}, response.data);
        delete this._metaData.markers;
        delete this._metaData.persons;
        this._sendMetaData(this._metaData);

        this._markers = new Markers(response.data.markers ? response.data.markers : response.data.persons);
        await mapHelper.createMap(this._google, this._mapControlId, this._metaData.icon, this._metaData.pin);
        mapHelper.createClusterer(this._markers.getMarkers());
        this._update(this._markers.getMarkers());

        if (this._markers.hasDates()) {
            this._slider = new Slider(
                this._dateControlId,
                this._markers.getDateMode(),
                this._markers.getMinYear(),
                this._markers.getMaxYear(),
                ([yearStart, yearEnd]) => {
                    const markers = this._markers.filter(yearStart, yearEnd);
                    mapHelper.updateClusterer(markers);
                    this._update(markers);
                }
            );
        }
    }

    _update(markers) {
        if ('update' in this._listeners) {
            this._listeners['update'](markers);
        }
    }

    _sendMetaData(metaData) {
        if ('metaData' in this._listeners) {
            this._listeners['metaData'](metaData);
        }
    }
}
