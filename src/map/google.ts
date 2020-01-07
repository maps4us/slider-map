import GoogleMapsLoader from 'google-maps';

const key = 'QUl6YVN5RENHenRmVXZ2eVNNVHRLX1lSU2Z6M2t4SlB4MzI2clhv';
GoogleMapsLoader.KEY = atob(key);

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
