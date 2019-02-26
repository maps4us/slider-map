import axios from 'axios';
import {Marker} from './markers';
import {MetaData} from './metaData';
import {DateMode, hasDates, getDateModeFromString} from '../date/dateMode';
import {dateFromString} from '../date/conversion';

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
    let minYear = new Date().getFullYear();

    markers.forEach(marker => {
        if (marker.dateRange && marker.dateRange.start && marker.dateRange.start.getFullYear() < minYear) {
            minYear = marker.dateRange.start.getFullYear();
        }
    });

    return dateFromString('1/1/' + minYear) as Date;
}

export function getMaxDate(markers: Marker[]): Date {
    const todayYear = new Date();
    let maxYear = 0;

    markers.forEach(marker => {
        let dateEnd = todayYear;
        if (marker.dateRange && marker.dateRange.end) {
            dateEnd = marker.dateRange.end;
        }

        if (dateEnd.getFullYear() > maxYear) {
            maxYear = dateEnd.getFullYear();
        }
    });

    return dateFromString('12/31/' + maxYear) as Date;
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

    console.log(markers);

    metaData.minDate = getMinDate(markers);
    metaData.maxDate = getMaxDate(markers);

    return {markers: markers, metaData};
}
