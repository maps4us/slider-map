import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import * as dateHelper from './date';

export default class Slider {
    private slider: noUiSlider.Instance;
    private dateFormatMode: number;

    public constructor(
        controlId: string,
        dateMode: dateHelper.DateMode,
        minYear: number,
        maxYear: number,
        changeCb: noUiSlider.Callback
    ) {
        this.slider = this.getSliderDom(controlId);
        this.dateFormatMode = dateMode;

        this.createSlider(this.timestamp(minYear), this.timestamp(maxYear));
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
                console.log(dateHelper.dateFromTime(value));
                return dateHelper.formatDate(dateHelper.dateFromTime(value), this.dateFormatMode);
            }
        };
    }

    private timestamp(year: number): number {
        const date = dateHelper.createDate(null, year.toString());
        if (date !== null) {
            return date.getTime();
        } else {
            return -1;
        }
    }
}
