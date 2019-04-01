declare module 'node-js-marker-clusterer' {
    class MarkerClusterer {
        public constructor(map: google.maps.Map, markers?: google.maps.Marker[], options?: object);
        public clearMarkers(): void;
    }

    export = MarkerClusterer;
}
