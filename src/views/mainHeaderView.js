import { publishEvent } from "../eventBus.js";


class MainHeaderView {
    constructor() {
        // The main HTML Element
        this._header;

        this._initView();
        this._setupEvents();
    };

    _initView() {
        this._header = document.createElement('header');
        this._header.id = 'header';
        this._header.className = 'header';

        const helpIcon = this._createHelpIcon();
        const gameTitle = this._createGameTitle();
        const statsSettingsContainer = this._createStatsSettingContainer();

        this._header.append(helpIcon, gameTitle, statsSettingsContainer);
    };

    _createHelpIcon() {
        const helpIcon = document.createElement('i');
        helpIcon.classList.add('fa-solid', 'fa-circle-question', 'header__help-icon');
        helpIcon.title = 'Help';

        return helpIcon;
    };

    _createGameTitle() {
        const gameTitle = document.createElement('p');
        gameTitle.textContent = 'What\'s That Keyboard';
        gameTitle.className = 'header__game-title';

        return gameTitle;
    };

    _createStatsSettingContainer() {
        const statsSettingsContainer = document.createElement('div');
        statsSettingsContainer.className = 'header__stats-settings__container';

        const statsIcon = this._createStatsIcon();
        const settingsIcon = this._createSettingsIcon();

        statsSettingsContainer.append(statsIcon, settingsIcon);

        return statsSettingsContainer;
    };

    _createStatsIcon() {
        const statsIcon = document.createElement('i');
        statsIcon.classList.add('fa-solid', 'fa-chart-simple', 'header__stats-icon');
        statsIcon.title = 'Statistics';

        return statsIcon;
    };

    _createSettingsIcon() {
        const settingsIcon = document.createElement('i');
        settingsIcon.classList.add('fa-solid', 'fa-gear', 'header__settings-icon');
        settingsIcon.title = 'Settings';

        return settingsIcon;
    }

    _setupEvents() {
        const helpIcon = this._header.querySelector('.header__help-icon');

        helpIcon.addEventListener('click', () => {
            publishEvent('helpIconClicked');
        });

        // TODO: Add events for stats, settings, and title click
    };

    displayView() {
        document.body.insertBefore(this._header, document.body.firstChild);
    };

    removeView() {
        this._header.remove();
    };
};

export default MainHeaderView;
