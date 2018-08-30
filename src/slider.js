import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

const formatter = {
    to: (value) => {
        return Math.round(value);
    }
};

export function createSlider(controlId, minYear, maxYear, changeCb) {
    let slider = document.getElementById(controlId);
    // clear out any slider that might have been created
    if (slider.noUiSlider) {
        slider.noUiSlider.destroy();
    }

    noUiSlider.create(slider, {
        start: [minYear, maxYear],
        connect: true,
        range: {
            min: minYear,
            max: maxYear
        },
        tooltips: [ formatter, formatter],
        pips: {
            mode: 'positions',
            values: [0, 25, 50, 75, 100],
            density: 4
        }
    });

    slider.noUiSlider.on('set', changeCb);
}
