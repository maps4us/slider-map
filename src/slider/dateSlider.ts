import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {formatDate} from '../date/format';
import {dateFromTime} from '../date/conversion';
import {MetaData} from '../marker/metaData';
import Slider from './slider';

export default class DateSlider extends Slider {
    private dateFormatMode: number;

    public constructor(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback) {
        super();
        this.slider = this.getSliderDom(controlId);
        this.dateFormatMode = metaData.dateMode;

        this.createDateSlider(
            (metaData.min as Date).getTime(),
            (metaData.max as Date).getTime(),
            metaData.singleHandle
        );
        this.slider.noUiSlider.on('set', changeCb);
    }

    private createDateSlider(minDate: number, maxDate: number, singleHandle: boolean): void {
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
