import SolidBtn from "./components/buttons/solidBtn.js";

import { publishEvent } from "../eventBus.js";
import { GAME_LAUNCH_DATE } from "../gameModel.js";
import { daysBetween } from "../utils/miscUtils.js";


/**
 * Display for the Game's Landing page.
 */
class LandingPageView {
    /**
     * Creates an instance of `LandingPageView`.
     * 
     * @param {Date} gameDate - The date of the game
     */
    constructor(gameDate) {
        this._gameDate = gameDate;

        this._landingPageContainer;

        this._fadeAnimationDelay = 0.5; // Delay between each key fade
        this._fadingKeys = [];

        this._createFadingKeys();
        this._initView();
    };

    _initView() {
        const fadingKeysContainer = this._createFadingKeysContainer(this._fadingKeys);

        const gameTitle = this._createGameTitle();
        const gameSubTitle = this._createGameSubTitle();
        const gameDate = this._createGameDateText();

        const playGameBtn = this._createPlayGameBtn();
        const howToPlayBtn = this._createHowToPlayBtn();

        const btnsContainer = this._createBtnsContainer(
            playGameBtn.HTMLElement, howToPlayBtn.HTMLElement
        );

        this._landingPageContainer = document.createElement('div');
        this._landingPageContainer.className = 'landing-page__container';

        this._landingPageContainer.append(
            fadingKeysContainer, gameTitle, gameSubTitle, gameDate, btnsContainer
        );
    };

    _createFadingKeys() {
        this._fadingKeys.push(this._createKey());
        this._fadingKeys.push(this._createKey());
        this._fadingKeys.push(this._createKey());
        this._fadingKeys.push(this._createKey());

        // Each key has a list of letters it will iterate over. When looked at
        // together, they will form words. E.g. 'BOND'
        const lettersToIterate = [
            ['E', 'L', 'F', 'G', 'K', 'J', 'R', 'V'],
            ['C', 'A', 'A', 'L', 'I', 'A', 'A', 'E'],
            ['H', 'M', 'C', 'O', 'T', 'M', 'I', 'R'],
            ['O', 'P', 'T', 'W', 'E', 'S', 'N', 'Y'],
        ];
    
        this._fadingKeys.forEach((key, idx) => {
            const isLast = (idx === (this._fadingKeys.length - 1)) ? true : false;

            this._initFadingKeyEffect(
                key, lettersToIterate[idx], this._fadeAnimationDelay * idx, isLast
            );
        });
    };

    _createFadingKeysContainer(fadingKeys) {
        const keysContainer = document.createElement('div');
        keysContainer.className = 'landing-page__keys-container';

        fadingKeys.forEach((key) => { keysContainer.append(key); });

        return keysContainer;
    };

    _createGameTitle() {
        const gameTitle = document.createElement('p');
        gameTitle.textContent = 'What\'s That Keyboard';
        gameTitle.className = 'landing-page__game-title';

        return gameTitle;
    };

    _createGameSubTitle() {
        const gameSubTitle = document.createElement('p');
        gameSubTitle.textContent = 'A daily memory game!';
        gameSubTitle.className = 'landing-page__subtitle-text';

        return gameSubTitle;
    };

    _createGameDateText() {
        const gameDateText = document.createElement('p');
        gameDateText.className = 'landing-page__date-text';
        gameDateText.innerHTML = `<strong>${this._getFormattedDateText()}</strong>
                                  <br>
                                  Game: <strong>#${this._getGameNumber() + 1}</strong>`;
        
        return gameDateText;
    };

    _getFormattedDateText() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dateMonth = months[this._gameDate.getMonth()];
        const dateDay = this._gameDate.getDate();
        const dateYear = this._gameDate.getFullYear();

        return `${dateMonth} ${dateDay}, ${dateYear}`;
    };

    _getGameNumber() {
        return daysBetween(this._gameDate, GAME_LAUNCH_DATE);
    };

    _createPlayGameBtn() {
        return new SolidBtn(
            'Play Game',
            () => { publishEvent('playBtnClicked') },
            true
        );
    };

    _createHowToPlayBtn() {
        return new SolidBtn(
            'How to Play',
            () => { 
                publishEvent('helpBtnClicked');
                publishEvent('playBtnClicked');
            },
            true
        );
    };

    _createBtnsContainer(playGameBtn, howToPlayBtn) {
        const btnsContainer = document.createElement('div');
        btnsContainer.className = 'landing-page__btns-container';
        btnsContainer.append(playGameBtn, howToPlayBtn);

        return btnsContainer;
    };

    _createKey() {
        const key = document.createElement('div');
        key.className = 'key';
        return key;
    };

    _initFadingKeyEffect(key, lettersToIterate, animationDelay, isLast) {
        key.classList.add('fade-in-anim');
        key.textContent = lettersToIterate[0];
        key.style.animationDelay = `${animationDelay}s`;

        let lettersIdx = 1;

        key.addEventListener('animationend', (e) => {
            if (e.animationName == 'fadeIn') {
                // Remove set delay, as fade out animation has it's own delay
                // and we want to use that
                key.style.animationDelay = '';
                key.classList.remove('fade-in-anim');
                key.classList.add('fade-out-anim');
            };

            if (e.animationName == 'fadeOut') {
                if (lettersIdx >= lettersToIterate.length) {
                    lettersIdx = 0;
                };

                key.textContent = lettersToIterate[lettersIdx++];

                if (isLast) {
                    this._resetAnimations();
                };
            };
        });
    };

    _resetAnimations() {
        this._fadingKeys.forEach((key, idx) => {
            key.classList.remove('fade-out-anim');
            key.classList.add('fade-in-anim');
            key.style.animationDelay = `${this._fadeAnimationDelay * idx}s`;
        });
    };

    displayView() {
        const gameArea = document.getElementById('gameArea');
        gameArea.append(this._landingPageContainer);
    };

    removeView() {
        this._landingPageContainer.remove();
    };
};

export default LandingPageView;
