import { publishEvent } from "../eventBus.js";

/**
 * @class TestBtn
 * 
 * 
 */
class TestBtn {
    constructor() {
        this.testMeBtn = document.createElement('div');

        this.testMeBtn.textContent = 'Test Me!';
        this.testMeBtn.classList.add('solid-btn', 'solid-btn-enabled', 'test-me-btn');

        this.testMeBtn.addEventListener('click', () => {
            publishEvent('testMeBtnClicked');
        });
    };

    displayTestMeBtn() {
        const gameInputSection = document.getElementById('gameInput');
        gameInputSection.appendChild(this.testMeBtn);
    };

    removeTestMeBtn() {
        this.testMeBtn.remove()
    };
};

export default TestBtn;
