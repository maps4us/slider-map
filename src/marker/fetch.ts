import axios from 'axios';
import {Marker} from './marker';
import {MetaData} from './metaData';
import {DateMode, hasDates, getDateModeFromString} from '../date/dateMode';
import {createPin} from '../map/pin';

export function getDateMode(markers: Marker[]): DateMode {
    let dateMode: DateMode = DateMode.NO_DATES;

    markers.forEach(marker => {
        const start = getDateModeFromString(marker.dateStart ? marker.dateStart : marker.yearFrom);
        const end = getDateModeFromString(marker.dateEnd ? marker.dateEnd : marker.yearTo);
        dateMode = Math.max(start, end, dateMode);

        if (dateMode === DateMode.YEAR_MONTH_DAY_DATES) {
            return;
        }
    });

    return dateMode;
}

export function getMinDate(markers: Marker[]): Date {
    const dates = markers
        .filter(marker => marker.dateRange && marker.dateRange.start)
        .map(marker => marker.dateRange.start);

    if (dates.length > 0) {
        return dates.reduce((p, v) => (p && v && p < v ? p : v)) as Date;
    }

    return new Date();
}

export function getMaxDate(markers: Marker[]): Date {
    const dates = markers
        .filter(marker => marker.dateRange && marker.dateRange.end)
        .map(marker => marker.dateRange.end);

    if (dates.length > 0) {
        return dates.reduce((p, v) => (p && v && p > v ? p : v)) as Date;
    }

    return new Date();
}

export async function fetch(mapId: string): Promise<{markers: Marker[]; metaData: MetaData}> {
    const response = await axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${mapId}.json`);
    let {markers, persons, ...metaData} = response.data;
    markers = markers ? markers : persons;

    metaData.dateMode = getDateMode(markers);
    metaData.hasDates = hasDates(metaData.dateMode);

    markers = markers.map((marker: Marker) => {
        marker = Object.assign(new Marker(), marker);
        marker.process(metaData.hasDates);
        return marker;
    });

    for (let i = 0; i < markers.length; i++) {
        if (typeof markers[i].pin === 'string' && markers[i].pin.length > 0) {
            markers[i].pin = await createPin(markers[i].pin);
        }
    }

    metaData.minDate = getMinDate(markers);
    metaData.maxDate = getMaxDate(markers);

    return {markers: markers, metaData};
}
