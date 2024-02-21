import { publishEvent } from "../eventBus.js";

/**
 * @class SubmitGuessBtnView
 * 
 * 
 */
class SubmitGuessBtnView {
    constructor() {
        this.submitGuessBtn = document.createElement('div');

        this.submitGuessBtn.textContent = 'Submit guess';
        this.submitGuessBtn.classList.add('solid-btn', 'submit-guess-btn');

        this.submitGuessBtn.addEventListener('click', () => {
            publishEvent('submitGuessBtnClicked');
        });
    };

    displaySubmitGuessBtn() {
        const gameInputSection = document.getElementById('gameInput');
        gameInputSection.appendChild(this.submitGuessBtn);
    };

    removeSubmitGuessBtn() {
        this.submitGuessBtn.remove()
    };
};

export default SubmitGuessBtnView;
