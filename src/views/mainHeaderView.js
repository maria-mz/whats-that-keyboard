import { publishEvent } from "../eventBus.js";


class MainHeaderView {
    constructor() {
        // The main HTML Element
        this._header = document.getElementById('header');
        this._setupEvents();
    };

    _setupEvents() {
        const helpIcon = this._header.querySelector('.header__help-icon');

        helpIcon.addEventListener('click', () => {
            publishEvent('helpIconClicked');
        });

        // TODO: Add events for stats, settings, and title click
    };

    get HTMLElement() {
        return this._header;
    };
};

export default MainHeaderView;
