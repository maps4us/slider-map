import axios from 'axios';
import Marker from './marker';
import MarkerFactory from './markerFactory';
import {MetaData} from './metaData';

interface MapResponse {
    markers: Marker[];
    metaData: MetaData;
}

export async function fetch(
    mapId: string,
    incrementViewCount: boolean
): Promise<{markers: Marker[]; metaData: MetaData}> {
    const response = await axios.get<MapResponse>(
        `https://us-central1-mapsforall-96ddd.cloudfunctions.net/getPublishedMap?` +
            `mapId=${mapId}&incrementViewCount=${incrementViewCount.toString()}`
    );

    let {markers, metaData} = response.data;

    markers = await Promise.all(markers.map(async (marker) => MarkerFactory.create(marker, metaData.markerType)));

    metaData = Object.assign(new MetaData(), metaData);
    metaData.init(markers);

    return {markers, metaData};
}
