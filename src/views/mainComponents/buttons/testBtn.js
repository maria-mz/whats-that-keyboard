import SolidBtn from "./solidBtn.js";
import { publishEvent } from "../../../eventBus.js";

/**
 * @class TestBtn
 * 
 * 
 */
class TestBtn extends SolidBtn {
    constructor() {
        super(
            'Test Me!',
            () => { publishEvent('testMeBtnClicked') },
            true
        );

        this.btn.classList.add('test-me-btn'); // TODO, since this is a
        // component, remove this class actually. let view position the btn
        // or maybe specify classes to add in constructor?
    };
};

export default TestBtn;
