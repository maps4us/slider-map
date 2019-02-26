import axios from 'axios';
import {Markers} from './markers';
import {MetaData} from './metaData';
import {getDateMode, getMinDate, getMaxDate, hasDates} from '../date/markers';

export async function fetch(mapId: string): Promise<{markers: Markers; metaData: MetaData}> {
    const response = await axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${mapId}.json`);
    const {markersJson, persons, ...metaData} = response.data;

    const markers: Markers = new Markers(markersJson ? markersJson : persons);

    metaData.dateMode = getDateMode(markers.getMarkers());
    metaData.minDate = getMinDate(markers.getMarkers());
    metaData.maxDate = getMaxDate(markers.getMarkers());
    metaData.hasDates = hasDates(metaData.dateMode);

    return {markers, metaData};
}
