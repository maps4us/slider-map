import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {MarkerType, MetaData} from '../marker/metaData';
import DateSlider from './dateSlider';
import NumericalSlider from './numericalSlider';

export default abstract class Slider {
    protected slider: noUiSlider.Instance;

    public static create(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback): Slider {
        if (metaData.markerType == MarkerType.NUMBER) {
            return new NumericalSlider(controlId, metaData, changeCb);
        }

        return new DateSlider(controlId, metaData, changeCb);
    }

    protected getSliderDom(controlId: string): noUiSlider.Instance {
        const slider: noUiSlider.Instance = document.getElementById(controlId) as noUiSlider.Instance;

        // clear out any slider that might have been created
        if (slider?.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
    }
}
