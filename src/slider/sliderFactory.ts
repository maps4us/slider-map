import {MarkerType, MetaData} from '../marker/metaData';
import DateSlider from './dateSlider';
import NumericalSlider from './numericalSlider';
import Slider from './slider';

export default class SliderFactory {
    public static create(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback): Slider {
        if (metaData.markerType == MarkerType.NUMBER) {
            return new NumericalSlider(controlId, metaData, changeCb);
        }

        return new DateSlider(controlId, metaData, changeCb);
    }
}
