class DayCountDownText {
    constructor(styleClassName) {
        this._dayToCountDownFrom = null;
        this._intervalId = null;
        this._countDownText = document.createElement('span');

        if (styleClassName) {
            this._countDownText.className = styleClassName;
        }
    };

    startCountDown() {
        if (this._intervalId !== null) {
            // Countdown already started, do nothing
            return;
        };

        this._dayToCountDownFrom = new Date().toDateString();
        this._updateCountDownText();
        this._intervalId = setInterval(this._updateCountDownText.bind(this), 1000);
    };

    stopCountDown() {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        };
    };

    _updateCountDownText() {
        const dateNow = new Date();

        const hoursLeft = this._getHoursLeft(dateNow);
        const minutesLeft = this._getMinutesLeft(dateNow);
        const secondsLeft = this._getSecondsLeft(dateNow);

        const text = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

        this._countDownText.textContent = text;

        if (this._isDayOver(dateNow)) {
            this._dayToCountDownFrom = null;
            this._countDownText.textContent = `00h 00m 00s`;
            this.stopCountDown();
        };
    };

    _isDayOver(date) {
        return this._dayToCountDownFrom !== date.toDateString();
    };

    _getHoursLeft(date) {
        const hoursLeft = 23 - date.getHours()
        return hoursLeft < 10 ? `0${hoursLeft}` : `${hoursLeft}`;
    };

    _getMinutesLeft(date) {
        const minutesLeft = 59 - date.getMinutes();
        return minutesLeft < 10 ? `0${minutesLeft}` : `${minutesLeft}`;
    };

    _getSecondsLeft(date) {
        const secondsLeft = 59 - date.getSeconds();
        return secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`;
    };

    get HTMLElement() {
        return this._countDownText;
    };
};

export default DayCountDownText;
