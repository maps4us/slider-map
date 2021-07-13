import MarkerClusterer from 'node-js-marker-clusterer';
import {Google} from './google';
import Marker from '../marker/marker';
import {OverlappingMarkerSpiderfier} from 'ts-overlapping-marker-spiderfier';
import {createResetZoomControl, createNoMarkersControl, clearNoMarkersControl} from './overlays';
import {createPin} from './pin';

const _clusterOptions = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 10,
    maxZoom: 15,
};

const _spiderfierOptions = {
    legWeight: 3,
    keepSpiderfied: true,
    spiderfiedShadowColor: false,
};

export class TheMap {
    private google: Google;
    private map: google.maps.Map;
    private bounds: google.maps.LatLngBounds;
    private markerClusterer: MarkerClusterer;
    private infoWindow?: google.maps.InfoWindow;
    private icon: string;
    private gmarkers: google.maps.Marker[];
    private markerContent: Map<google.maps.Marker, string>;
    private pinUrl: string;
    private pin: google.maps.Icon;
    private spiderfier: OverlappingMarkerSpiderfier;

    public constructor() {
        this.infoWindow = undefined;
        this.icon = 'https://image.ibb.co/cf584S/favicon.png';
        this.gmarkers = [];
        this.pinUrl =
            'https://firebasestorage.googleapis.com/v0/b/mapsforall-96ddd.appspot.com/o/images%2Fpins%2F' +
            'transparent-pin-no-border.png?alt=media&token=e5769cf5-15cd-4073-93d8-014349368f7a';
        this.markerContent = new Map();
    }

    public async createMap(google: Google, mapControlId: string, icon: string, pin: string): Promise<void> {
        this.google = google;
        let isPinCreated: boolean;
        this.map = new google.maps.Map(document.getElementById(mapControlId) as HTMLElement, {
            zoom: 3,
            maxZoom: 17,
            center: {
                lat: -28.024,
                lng: 140.887,
            },
        });

        this.createSpiderfier();
        createResetZoomControl(this.map, () => this.map.fitBounds(this.bounds));

        if (icon && icon.length > 0) {
            this.icon = icon;
        }

        isPinCreated = false;
        if (pin && pin.length > 0) {
            this.pin = await createPin(pin);
            if (this.pin?.anchor && this.pin.anchor.x !== 0) {
                isPinCreated = true;
            }
        }
        if (isPinCreated === false) {
            this.pin = {
                url: this.pinUrl,
                anchor: new google.maps.Point(12, 29),
                scaledSize: new google.maps.Size(24, 29),
            };
        }
    }

    private createSpiderfier(): void {
        this.spiderfier = new OverlappingMarkerSpiderfier(this.map, _spiderfierOptions);
        this.spiderfier.addListener('click', (gmarker: google.maps.Marker) => this.openInfoWindow(gmarker));

        const mti = google.maps.MapTypeId;
        if (this.spiderfier.legColors.usual && this.spiderfier.legColors.highlighted) {
            this.spiderfier.legColors.usual[mti.HYBRID] = this.spiderfier.legColors.usual[mti.SATELLITE] = '#444';
            this.spiderfier.legColors.usual[mti.TERRAIN] = this.spiderfier.legColors.usual[mti.ROADMAP] = '#444';
            this.spiderfier.legColors.highlighted[mti.HYBRID] = this.spiderfier.legColors.highlighted[
                mti.SATELLITE
            ] = this.spiderfier.legColors.highlighted[mti.TERRAIN] = this.spiderfier.legColors.highlighted[
                mti.ROADMAP
            ] = '#444';
        }
    }

    public createClusterer(markers: Marker[]): void {
        this.markerClusterer = new MarkerClusterer(this.map, this.getGMarkers(markers), _clusterOptions);
        this.setSpiderfierMarkers(this.gmarkers);
        this.map.fitBounds(this.bounds);
    }

    public updateClusterer(markers: Marker[]): void {
        this.markerClusterer.clearMarkers();
        this.markerClusterer = new MarkerClusterer(this.map, this.getGMarkers(markers), _clusterOptions);
        this.setSpiderfierMarkers(this.gmarkers);
        this.map.fitBounds(this.bounds);

        if (markers.length === 0) {
            this.map.panTo({lat: -28.024, lng: 140.887});
            this.map.setZoom(1);
            createNoMarkersControl(this.map);
        } else {
            clearNoMarkersControl(this.map);
        }
    }

    public panTo(markerToFind: Marker): void {
        this.map.panTo({lat: markerToFind.lat as number, lng: markerToFind.lng});

        const foundMarker = this.gmarkers.find(
            (gmarker: google.maps.Marker) =>
                gmarker.getTitle() === markerToFind.name &&
                (gmarker.getPosition() as google.maps.LatLng).lat() === markerToFind.lat
        );

        this.map.setZoom(_clusterOptions.maxZoom);
        this.google.maps.event.trigger(foundMarker, 'click');
    }

    private setSpiderfierMarkers(markers: google.maps.Marker[]): void {
        this.spiderfier.removeAllMarkers();
        markers.forEach((marker) => this.spiderfier.addMarker(marker, () => {}));
    }

    private getGMarkers(markers: Marker[]): google.maps.Marker[] {
        this.gmarkers = [];
        this.bounds = new google.maps.LatLngBounds();

        markers.forEach((marker) => {
            const pin = marker.pin ? (marker.pin as google.maps.Icon) : this.pin;

            const gmarker = new google.maps.Marker({
                position: {lat: marker.lat as number, lng: marker.lng},
                title: marker.name,
                icon: pin,
            });

            const icon = marker.icon ? marker.icon : this.icon;

            let link = '';
            if (marker.link) {
                link = `<br><a href="${marker.link.url}" target="_blank">${marker.link.title}</a>`;
            }

            this.markerContent.set(
                gmarker,
                `<img src="${icon}" width="32" height="32"><b> ${marker.name}</b>` +
                    `<br>${marker.displayLocation}` +
                    `${marker.displayData ? `<br>${marker.displayData}` : ``}` +
                    `${marker.addInfo ? `<br>${marker.addInfo}` : ``}` +
                    `${link}`
            );

            this.bounds.extend(gmarker.getPosition() as google.maps.LatLng);
            gmarker.addListener('click', () => this.openInfoWindow(gmarker));

            this.gmarkers.push(gmarker);
        });

        return this.gmarkers;
    }

    private openInfoWindow(gmarker: google.maps.Marker): void {
        if (this.infoWindow != null) {
            this.infoWindow.close();
        }
        this.infoWindow = new google.maps.InfoWindow({
            content: this.markerContent.get(gmarker),
        });
        this.infoWindow.open(this.map, gmarker);
    }
}
