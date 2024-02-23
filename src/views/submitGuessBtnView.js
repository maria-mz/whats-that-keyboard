import { publishEvent } from "../eventBus.js";

/**
 * @class SubmitGuessBtnView
 * 
 * 
 */
class SubmitGuessBtnView {
    constructor(isEnabled) {
        this.btn = document.createElement('div');
        this.btn.textContent = 'Submit guess';
        this.btn.classList.add('solid-btn', 'submit-guess-btn');

        if (isEnabled === true) {
            this.enableBtn();
        }
        else {
            this.disableBtn();
        };
    };

    disableBtn() {
        this.btn.classList.add('solid-btn-disabled');
        this.btn.classList.remove('solid-btn-enabled');
        this.btn.onclick = null;
    };

    enableBtn() {
        this.btn.classList.add('solid-btn-enabled');
        this.btn.classList.remove('solid-btn-disabled');
        this.btn.onclick = () => {
            publishEvent('submitGuessBtnClicked');
        };
    };

    displayBtn() {
        const gameInputSection = document.getElementById('gameInput');
        gameInputSection.appendChild(this.btn);
    };

    removeBtn() {
        this.btn.remove();
    };
};

export default SubmitGuessBtnView;
