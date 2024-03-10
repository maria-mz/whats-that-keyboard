import { publishEvent } from "../eventBus.js";

/**
 * @class TestBtn
 * 
 * 
 */
class TestBtn {
    constructor() {
        this.btn = document.createElement('div');

        this.btn.textContent = 'Test Me!';
        this.btn.classList.add('solid-btn', 'solid-btn-enabled', 'test-me-btn');

        this.btn.addEventListener('click', () => {
            publishEvent('testMeBtnClicked');
        });
    };

    get HTMLElement() {
        return this.btn;
    };
};

export default TestBtn;
