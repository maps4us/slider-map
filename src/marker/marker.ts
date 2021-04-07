import {MetaData} from './metaData';

interface Link {
    title: string;
    url: string;
}

interface Location {
    city: string;
    country: string;
    lat: string;
    long: string;
    state: string;
}

interface Data {
    value?: Value;
    range?: Range;
}

interface Range {
    start?: Value;
    end?: Value;
}

type Value = string | Date | number;

export default abstract class Marker {
    public name: string;
    public addInfo: string;
    public icon: string;
    public pin: string | google.maps.Icon;
    public link: Link;
    public location: Location;

    public data: Data;
    public originalData?: Data;

    public displayLocation: string;
    public displayData?: string;
    public lat: number;
    public lng: number;

    public abstract init(): Promise<void>;
    public abstract isInRange(values: number[], metaData: MetaData): boolean;
}
