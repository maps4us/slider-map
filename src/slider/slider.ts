import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {formatDate} from '../date/format';
import {dateFromTime} from '../date/conversion';
import {MetaData} from '../marker/metaData';

export default class Slider {
    private slider: noUiSlider.Instance;
    private dateFormatMode: number;

    public constructor(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback) {
        this.slider = this.getSliderDom(controlId);
        this.dateFormatMode = metaData.dateMode;

        this.createSlider(metaData.minDate.getTime(), metaData.maxDate.getTime(), metaData.singleHandle);
        this.slider.noUiSlider.on('set', changeCb);
    }

    private getSliderDom(controlId: string): noUiSlider.Instance {
        const slider: noUiSlider.Instance = document.getElementById(controlId) as noUiSlider.Instance;

        // clear out any slider that might have been created
        if (slider != null && slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
    }

    private createSlider(minDate: number, maxDate: number, singleHandle: boolean): void {
        noUiSlider.create(this.slider, {
            start: singleHandle ? (minDate + maxDate) / 2 : [minDate, maxDate],
            connect: true,
            range: {
                min: minDate,
                max: maxDate,
            },
            tooltips: singleHandle ? this.formatter() : [this.formatter(), this.formatter()],
            pips: {
                mode: 'positions',
                values: [0, 25, 50, 75, 100],
                density: 4,
                format: this.formatter(),
            },
        });
    }

    private formatter(): object {
        return {
            to: (value: number) => {
                return formatDate(dateFromTime(value), this.dateFormatMode);
            },
        };
    }
}
