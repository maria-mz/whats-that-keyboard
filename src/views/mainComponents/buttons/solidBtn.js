/**
 * @class SolidBtn
 * 
 * 
 */
class SolidBtn {
    constructor(btnText, onBtnClickCallback, isEnabled = true) {
        this.onBtnClickCallback = onBtnClickCallback;

        this.btn = document.createElement('div');
        this.btn.textContent = btnText;
        this.btn.classList.add('solid-btn');

        this.btnIsEnabled;

        if (isEnabled) {
            this._enableBtn();
        }
        else {
            this._disableBtn();
        };
    };

    _enableBtn() {
        this.btn.classList.add('solid-btn-enabled');
        this.btn.classList.remove('solid-btn-disabled');
        this.btn.onclick = this.onBtnClickCallback;
        this.btnIsEnabled = true;
    };

    _disableBtn() {
        this.btn.classList.add('solid-btn-disabled');
        this.btn.classList.remove('solid-btn-enabled');
        this.btn.onclick = null;
        this.btnIsEnabled = false;
    };

    enableBtn() {
        if (!this.btnIsEnabled) {
            this._enableBtn();
        };
    };

    disableBtn() {
        if (this.btnIsEnabled) {
            this._disableBtn();
        };
    };

    get HTMLElement() {
        return this.btn;
    };
};

export default SolidBtn;
