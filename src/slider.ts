import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import {formatDate, dateFromTime} from './date.js';

export default class Slider {
    slider: any;
    dateFormatMode: number;
    changeCb: noUiSlider.Callback;

    constructor(controlId: string, dateMode: number, minYear: number, maxYear: number, changeCb: any) {
        this.slider = this.getSliderDom(controlId);

        this.dateFormatMode = dateMode;

        this.createSlider(minYear.toString(), maxYear.toString());

        this.changeCb = changeCb;
        this.slider.noUiSlider.on('set', this.changeCb);
    }

    private getSliderDom(controlId: string): HTMLElement {
        const slider: any = document.getElementById(controlId);

        // clear out any slider that might have been created
        if (slider != null && slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
    }

    private createSlider(minYear: string, maxYear: string) {
        noUiSlider.create(this.slider, {
            start: [this.timestamp(minYear), this.timestamp(maxYear)],
            connect: true,
            range: {
                min: this.timestamp(minYear),
                max: this.timestamp(maxYear)
            },
            tooltips: [this.formatter(), this.formatter()],
            pips: {
                mode: 'positions',
                values: [0, 25, 50, 75, 100],
                density: 4,
                format: this.formatter()
            }
        });
    }

    private formatter() {
        return {
            to: (value: number) => {
                return formatDate(dateFromTime(value), this.dateFormatMode);
            }
        };
    }

    private timestamp(date: string) {
        return new Date(date).getTime();
    }
}
