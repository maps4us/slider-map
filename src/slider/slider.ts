import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

export default abstract class Slider {
    protected slider: noUiSlider.Instance;

    protected getSliderDom(controlId: string): noUiSlider.Instance {
        const slider: noUiSlider.Instance = document.getElementById(controlId) as noUiSlider.Instance;

        // clear out any slider that might have been created
        if (slider?.noUiSlider) {
            slider.noUiSlider.destroy();
        }

        return slider;
    }
}
