import { publishEvent } from "../eventBus.js";

/**
 * @class TestMeBtnView
 * 
 * 
 */
class TestMeBtnView {
    constructor() {
        this.testMeBtn = document.createElement('div');

        this.testMeBtn.textContent = 'Test me!';
        this.testMeBtn.classList.add('solid-btn', 'test-me-btn');

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

export default TestMeBtnView;
