import GoogleMapsLoader from 'google-maps';

declare global {
    interface Window {
        google: Google;
    }
}

export interface Google {
    maps: typeof google.maps;
}
interface GCallBack {
    (google: Google): void;
}

export function fetchGoogle(cb: GCallBack): void {
    if (window.google !== undefined) {
        cb(window.google);
    } else {
        GoogleMapsLoader.load((google: Google) => {
            cb(google);
        });
    }
}
