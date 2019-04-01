import MarkerClusterer from 'node-js-marker-clusterer';
import {Google} from './google';
import {Marker} from '../marker/marker';
import {OverlappingMarkerSpiderfier} from 'ts-overlapping-marker-spiderfier';

const _clusterOptions = {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 10,
    maxZoom: 15
};

const _spiderfierOptions = {
    legWeight: 3,
    keepSpiderfied: true,
    spiderfiedShadowColor: false
};

// class GMarker extends google.maps.Marker {
//     public content: string;
// }

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
    private pin: object;
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

        this.map = new google.maps.Map(document.getElementById(mapControlId), {
            zoom: 3,
            center: {
                lat: -28.024,
                lng: 140.887
            }
        });

        this.createSpiderfier();
        this.createResetZoomControl();

        if (icon && icon.length > 0) {
            this.icon = icon;
        }

        await this.createPin(pin);
    }

    private createSpiderfier(): void {
        this.spiderfier = new OverlappingMarkerSpiderfier(this.map, _spiderfierOptions);
        this.spiderfier.addListener('click', (gmarker: google.maps.Marker) => this.openInfoWindow(gmarker));

        const mti = google.maps.MapTypeId;
        if (this.spiderfier.legColors.usual && this.spiderfier.legColors.highlighted) {
            console.log('we are setting stuff');
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
    }

    public panTo(markerToFind: Marker): void {
        this.map.panTo({lat: markerToFind.lat as number, lng: markerToFind.lng});

        const foundMarker = this.gmarkers.find(
            (gmarker: google.maps.Marker) =>
                gmarker.getTitle() === markerToFind.name && gmarker.getPosition().lat() === markerToFind.lat
        );

        this.map.setZoom(_clusterOptions.maxZoom);
        this.google.maps.event.trigger(foundMarker, 'click');
    }

    private setSpiderfierMarkers(markers: google.maps.Marker[]): void {
        this.spiderfier.removeAllMarkers();
        markers.forEach(marker => this.spiderfier.addMarker(marker, () => {}));
    }

    private getGMarkers(markers: Marker[]): google.maps.Marker[] {
        this.gmarkers = [];
        this.bounds = new google.maps.LatLngBounds();

        markers.forEach(marker => {
            const gmarker = new google.maps.Marker({
                position: {lat: marker.lat as number, lng: marker.lng},
                title: marker.name,
                icon: this.pin
            });

            const icon = marker.icon ? marker.icon : this.icon;

            let website = '';
            if (marker.website) {
                website = `<br><a href="${marker.website.url}" target="_blank">${marker.website.title}</a>`;
            }

            this.markerContent.set(
                gmarker,
                `<img src="${icon}" width="32" height="32"><b> ${marker.name}</b>` +
                    `<br>${marker.displayLocation}` +
                    `${marker.dateRange ? `<br>${marker.dateRange.displayStr}` : ``}` +
                    `${marker.addInfo ? `<br>${marker.addInfo}` : ``}` +
                    `${website}`
            );

            this.bounds.extend(gmarker.getPosition());
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
            content: this.markerContent.get(gmarker)
        });
        this.infoWindow.open(this.map, gmarker);
    }

    private async createPin(pin: string): Promise<void> {
        if (pin && pin.length > 0) {
            const img: HTMLImageElement = await this.getImage(pin);

            let height = img.height;
            let width = img.width;

            if (img.height > 100 || img.width > 100) {
                height = height * (32.0 / width);
                width = 32;
            }

            this.pin = {
                url: pin,
                anchor: new google.maps.Point(width / 2, height),
                scaledSize: new google.maps.Size(width, height)
            };
        } else {
            this.pin = {
                url: this.pinUrl,
                anchor: new google.maps.Point(12, 29),
                scaledSize: new google.maps.Size(24, 29)
            };
        }
    }

    private getImage(imgUrl: string): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            let img = new Image();
            img.src = imgUrl;
            img.onload = () => resolve(img);
        });
    }

    private createResetZoomControl(): void {
        let controlDiv = document.createElement('div');

        // https://developers.google.com/maps/documentation/javascript/controls
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginLeft = '10px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Reset Zoom';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        let controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Reset Zoom';
        controlUI.appendChild(controlText);

        controlUI.addEventListener('click', () => this.map.fitBounds(this.bounds));

        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
    }
}
