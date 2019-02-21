import axios from 'axios';
import Markers from './markers';
import * as domHelper from './dom';
import Slider from './slider';
import * as mapHelper from './map';
import './style.css';
import {google, fetchGoogle} from './google';

export interface MapsCallBack {
    (data: object): void;
}

interface MetaData {
    markers: any;
    persons: any;
    pin: string;
    icon: string;
    publishedDate: string;
    title: string;
}

export default class TimeLineMap {
    private google: google;
    private mapId: string;
    private markers: Markers;
    private slider: Slider;
    private mapControlId: string;
    private dateControlId: string;
    private listeners: Map<string, MapsCallBack>;
    private metaData: MetaData;

    public constructor() {
        this.mapId = '';
        this.mapControlId = 'timeLineMapControl';
        this.dateControlId = 'timeLineDateControl';
        this.listeners = new Map<string, MapsCallBack>();

        this.processArguments(arguments);
    }

    public create() {
        fetchGoogle((google: google) => {
            this.google = google;
            this.createTimeLineMap();
        });
    }

    public addListener(type: string, cb: MapsCallBack) {
        this.listeners.set(type, cb);
    }

    public select(marker: object) {
        mapHelper.panTo(marker);
    }

    private processArguments(passedArguments: IArguments) {
        this.mapId = passedArguments[0];
        if (passedArguments.length === 3) {
            this.mapControlId = passedArguments[1];
            this.dateControlId = passedArguments[2];
            domHelper.addClasses(this.mapControlId, this.dateControlId);
        } else {
            const parentDivId = passedArguments[1];
            domHelper.createControlDivs(parentDivId, this.mapControlId, this.dateControlId);
        }

        domHelper.ensureMapHeight(this.mapControlId);
    }

    private async createTimeLineMap() {
        const response = await axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${this.mapId}.json`);
        const {markers, persons, ...metaData} = response.data;
        this.metaData = metaData;
        this.sendMetaData(this.metaData);

        this.markers = new Markers(markers ? markers : persons);
        await mapHelper.createMap(this.google, this.mapControlId, this.metaData.icon, this.metaData.pin);
        mapHelper.createClusterer(this.markers.getMarkers());
        this.update(this.markers.getMarkers());

        if (this.markers.hasDates()) {
            this.slider = new Slider(
                this.dateControlId,
                this.markers.getDateMode(),
                this.markers.getMinYear(),
                this.markers.getMaxYear(),
                ([yearStart, yearEnd]: number[]) => {
                    const markers = this.markers.filter(yearStart, yearEnd);
                    mapHelper.updateClusterer(markers);
                    this.update(markers);
                }
            );
        }
    }

    private update(markers: object) {
        if (this.listeners.has('update')) {
            const fn = this.listeners.get('update') as MapsCallBack;
            fn(markers);
        }
    }

    private sendMetaData(metaData: MetaData) {
        if (this.listeners.has('metaData')) {
            const fn = this.listeners.get('metaData') as MapsCallBack;
            fn(metaData);
        }
    }
}
