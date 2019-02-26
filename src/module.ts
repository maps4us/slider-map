import {Markers} from './marker/markers';
import {MetaData} from './marker/metaData';
import {fetch} from './marker/fetch';
import * as domHelper from './dom/dom';
import Slider from './slider/slider';
import * as mapHelper from './map/map';
import {Google, fetchGoogle} from './map/google';

export interface MapsCallBack {
    (data: object): void;
}

export default class TimeLineMap {
    private google: Google;
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

    public create(): void {
        fetchGoogle((google: Google) => {
            this.google = google;
            this.createTimeLineMap();
        });
    }

    public addListener(type: string, cb: MapsCallBack): void {
        this.listeners.set(type, cb);
    }

    public select(marker: object): void {
        mapHelper.panTo(marker);
    }

    private processArguments(passedArguments: IArguments): void {
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

    private async createTimeLineMap(): Promise<void> {
        const {markers, metaData} = await fetch(this.mapId);
        this.markers = markers;
        this.metaData = metaData;
        this.sendMetaData(this.metaData);

        await mapHelper.createMap(this.google, this.mapControlId, this.metaData.icon, this.metaData.pin);
        mapHelper.createClusterer(this.markers.getMarkers());
        this.update(this.markers.getMarkers());

        if (this.metaData.hasDates) {
            this.slider = new Slider(this.dateControlId, this.metaData, ([yearStart, yearEnd]: number[]) => {
                const markers = this.markers.filter(yearStart, yearEnd, this.metaData);
                mapHelper.updateClusterer(markers);
                this.update(markers);
            });
        }
    }

    private update(markers: object): void {
        if (this.listeners.has('update')) {
            const fn = this.listeners.get('update') as MapsCallBack;
            fn(markers);
        }
    }

    private sendMetaData(metaData: MetaData): void {
        if (this.listeners.has('metaData')) {
            const fn = this.listeners.get('metaData') as MapsCallBack;
            fn(metaData);
        }
    }
}
