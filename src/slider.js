import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import { formatStrDate } from './date.js';

export default class Slider {
    constructor(controlId, dateMode, minYear, maxYear, changeCb) {
        this._slider = this._getSliderDom(controlId);

        this._dateFormatMode = dateMode;

        this._createSlider(minYear, maxYear);

        this._changeCb = changeCb;
        this._slider.noUiSlider.on('set', this._changeCb);
    }

    _getSliderDom(controlId) {
        const slider = document.getElementById(controlId);

        // clear out any slider that might have been created
        if (slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
    }

    _createSlider(minYear, maxYear) {
        noUiSlider.create(this._slider, {
            start: [this._timestamp(minYear), this._timestamp(maxYear)],
            connect: true,
            range: {
                min: this._timestamp(minYear),
                max: this._timestamp(maxYear)
            },
            tooltips: [ this._formatter(), this._formatter()],
            pips: {
                mode: 'positions',
                values: [0, 25, 50, 75, 100],
                density: 4
            }
        });
    }

    _formatter() {
        return {
            to: (value) => {
                return formatStrDate(Math.round(value), this._dateFormatMode);
            }
        };
    }

    _timestamp(str) {
        return new Date(str).getTime();
    }
}
