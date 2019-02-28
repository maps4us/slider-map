import GoogleMapsLoader from 'google-maps';

declare global {
    interface Window {
        google: Google;
    }
}

export interface Google {
    maps: typeof google.maps;
}

export function fetchGoogle(): Promise<Google> {
    return new Promise(resolve => {
        if (window.google !== undefined) {
            resolve(window.google);
        } else {
            GoogleMapsLoader.load((google: Google) => {
                resolve(google);
            });
        }
    });
}
