import SolidBtn from "./solidBtn.js";
import { publishEvent } from "../../../eventBus.js";

/**
 * @class SubmitGuessBtn
 * 
 * 
 */
class SubmitGuessBtn extends SolidBtn {
    constructor(isEnabled) {
        super(
            'Submit Guess',
            () => { publishEvent('submitGuessBtnClicked') },
            isEnabled
        );

        this.btn.classList.add('submit-guess-btn'); // TODO, since this is a
        // component, remove this class actually. let view position the btn.
        // or maybe specify classes to add in constructor?
    };
};

export default SubmitGuessBtn;
