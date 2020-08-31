import {Loader, LoaderOptions} from 'google-maps';

const key = 'QUl6YVN5RENHenRmVXZ2eVNNVHRLX1lSU2Z6M2t4SlB4MzI2clhv';
const options: LoaderOptions = {
    /* todo */
};
const loader = new Loader(atob(key), options);

declare global {
    interface Window {
        google: Google;
    }
}

export interface Google {
    maps: typeof google.maps;
}

export async function fetchGoogle(): Promise<Google> {
    if (window.google !== undefined) {
        return new Promise((resolve) => {
            resolve(window.google);
        });
    }
    return await loader.load();
}
