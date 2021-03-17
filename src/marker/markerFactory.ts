import {MarkerType} from './metaData';
import DateMarker from './dateMarker';
import NumericalMarker from './numericalMarker';
import Marker from './marker';

export default class MarkerFactory {
    public static async create(marker: Marker, type: MarkerType): Promise<Marker> {
        const typedMarker: Marker =
            type == MarkerType.DATE
                ? Object.assign(new DateMarker(), marker)
                : Object.assign(new NumericalMarker(), marker);
        await typedMarker.init();
        return typedMarker;
    }
}
