import GoogleMapsLoader from 'google-maps';

declare global {
    interface Window {
        google: google;
    }
}

export type google = {maps: typeof google.maps};
interface GCallBack {
    (google: google): void;
}

export function fetchGoogle(cb: GCallBack) {
    if (window.google !== undefined) {
        cb(window.google);
    } else {
        GoogleMapsLoader.load((google: google) => {
            cb(google);
        });
    }
}
