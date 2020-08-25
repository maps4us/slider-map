import axios from 'axios';
import {Marker} from './marker';
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

    const {markers, metaData} = response.data;

    for (let marker of markers) {
        marker.init();
    }

    metaData.init(markers);

    return {markers, metaData};
}
