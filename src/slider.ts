import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import * as dateHelper from './date';

export default class Slider {
    private slider: noUiSlider.Instance;
    private dateFormatMode: number;

    public constructor(
        controlId: string,
        dateMode: dateHelper.DateMode,
        minYear: Date,
        maxYear: Date,
        changeCb: noUiSlider.Callback
    ) {
        this.slider = this.getSliderDom(controlId);
        this.dateFormatMode = dateMode;

        this.createSlider(minYear.getTime(), maxYear.getTime());
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

    private createSlider(minYear: number, maxYear: number): void {
        noUiSlider.create(this.slider, {
            start: [minYear, maxYear],
            connect: true,
            range: {
                min: minYear,
                max: maxYear
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

    private formatter(): object {
        return {
            to: (value: number) => {
                return dateHelper.formatDate(dateHelper.dateFromTime(value), this.dateFormatMode);
            }
        };
    }
}
