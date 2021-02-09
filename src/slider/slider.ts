import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {formatDate} from '../date/format';
import {dateFromTime} from '../date/conversion';
import {MarkerType, MetaData} from '../marker/metaData';

export default class Slider {
    private slider: noUiSlider.Instance;
    private dateFormatMode: number;

    public constructor(controlId: string, metaData: MetaData, changeCb: noUiSlider.Callback) {
        this.slider = this.getSliderDom(controlId);
        this.dateFormatMode = metaData.dateMode;

        if (metaData.markerType == MarkerType.DATE) {
            this.createDateSlider(
                (metaData.min as Date).getTime(),
                (metaData.max as Date).getTime(),
                metaData.singleHandle
            );
        } else {
            this.createNumberSlider(metaData.min as number, metaData.max as number, metaData.singleHandle);
        }
        this.slider.noUiSlider.on('set', changeCb);
    }

    private getSliderDom(controlId: string): noUiSlider.Instance {
        const slider: noUiSlider.Instance = document.getElementById(controlId) as noUiSlider.Instance;

        // clear out any slider that might have been created
        if (slider?.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
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

    private formatter(): object {
        return {
            to: (value: number) => {
                return formatDate(dateFromTime(value), this.dateFormatMode);
            },
        };
    }
}
