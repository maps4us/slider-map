import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {MetaData} from '../marker/metaData';
import Slider from './slider';

export default class NumericalSlider extends Slider {
    public constructor(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback) {
        super();
        this.slider = this.getSliderDom(controlId);
        this.createNumberSlider(metaData.min as number, metaData.max as number, metaData.singleHandle);
        this.slider.noUiSlider.on('set', changeCb);
    }

    private createNumberSlider(min: number, max: number, singleHandle: boolean): void {
        noUiSlider.create(this.slider, {
            start: singleHandle ? (min + max) / 2 : [min, max],
            connect: true,
            range: {
                min: min,
                max: max,
            },
            tooltips: true,
            pips: {
                mode: 'positions',
                values: [0, 25, 50, 75, 100],
                density: 4,
            },
        });
    }
}
