import SolidBtn from "./mainComponents/buttons/solidBtn.js";
import { publishEvent } from "../eventBus.js";


class LandingPageView {
    constructor() {
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

        const playGameBtn = this._createPlayGameBtn();
        const howToPlayBtn = this._createHowToPlayBtn();

        const btnsContainer = this._createBtnsContainer(
            playGameBtn.HTMLElement, howToPlayBtn.HTMLElement
        );

        this._landingPageContainer = document.createElement('div');
        this._landingPageContainer.className = 'landing-page__container';

        this._landingPageContainer.append(
            fadingKeysContainer, gameTitle, gameSubTitle, btnsContainer
        );
    };

    _createFadingKeys() {
        this._fadingKeys.push(this.createKey());
        this._fadingKeys.push(this.createKey());
        this._fadingKeys.push(this.createKey());
        this._fadingKeys.push(this.createKey());

        // Each key has a list of letters it will iterate over. When looked at
        // together, they will form words. E.g. 'BOND'
        const lettersToIterate = [
            ['A', 'B', 'F', 'G', 'H', 'J', 'Q', 'V'],
            ['P', 'O', 'A', 'L', 'I', 'A', 'U', 'E'],
            ['E', 'N', 'C', 'O', 'K', 'M', 'I', 'R'],
            ['X', 'D', 'T', 'W', 'E', 'S', 'Z', 'Y'],
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
        gameSubTitle.textContent = 'The daily keyboard guessing game!';
        gameSubTitle.className = 'landing-page__subtitle-text';

        return gameSubTitle;
    };

    _createPlayGameBtn() {
        return new SolidBtn(
            'Play Game',
            () => { publishEvent('playBtnClicked') }, // -> game starts
            true
        );
    };

    _createHowToPlayBtn() {
        return new SolidBtn(
            'How to Play',
            () => { 
                publishEvent('helpIconClicked'); // -> help window pops up
                publishEvent('playBtnClicked'); // -> game starts
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

    createKey() {
        const key = document.createElement('div');
        key.className = 'key';
        return key;
    };

    _initFadingKeyEffect(key, lettersToIterate, animationDelay, isLast = false) {
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
                    this.resetAnimations();
                };
            };
        });
    };

    resetAnimations() {
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
