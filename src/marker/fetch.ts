import axios from 'axios';
import {Marker} from './marker';
import {MetaData} from './metaData';
import {DateMode, hasDates, getDateModeFromString} from '../date/dateMode';

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

    let processedMarkers = [];
    for (let marker of markers) {
        let processedMarker = Object.assign(new Marker(), marker);
        await processedMarker.process(metaData.hasDates);
        processedMarkers.push(processedMarker);
    }

    metaData.minDate = getMinDate(processedMarkers);
    metaData.maxDate = getMaxDate(processedMarkers);

    return {markers: processedMarkers, metaData};
}
