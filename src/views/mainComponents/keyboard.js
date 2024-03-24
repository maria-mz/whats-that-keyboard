import { isLetter } from '../../utils/miscUtils.js';
import { getQWERTYLetterMapFunc } from '../../utils/keyboardUtils.js';
import { publishEvent } from '../../eventBus.js';


/**
 * Represents a keyboard HTML component with interactive features.
 */
class Keyboard {
    /**
     * Constructs a new `Keyboard` HTML component.
     * 
     * @param {Object} keysLayout - The layout of keys for the keyboard
     * @param {boolean} showAnim - To show pop-up animation on display or not
     */
    constructor(keysLayout, showAnim) {
        this.letterToKeyDiv = {};
        this.letterToIsHighlighed = {};
        this.keyToCanType = {};
        this.mapQWERTYKeyToKeyboardKey = getQWERTYLetterMapFunc(keysLayout);

        this._initKeyboardDiv(keysLayout);
        this._initDefaultTyping();
        this._initHighlightedState(keysLayout);

        if (showAnim) {
            this._addKeysAnimation();
        };
    };

    /**
     * Initializes default typing behaviour for keys.
     * 
     * By default, all letters can be typed, as well as 'Enter' and 'Backspace'.
     */
    _initDefaultTyping() {
        Object.keys(this.letterToKeyDiv).forEach((letter) => {
            this.keyToCanType[letter] = true;
        });

        this.keyToCanType['Enter'] = true;
        this.keyToCanType['Backspace'] = true;
    };

    /**
     * Initializes the keyboard HTML element.
     * 
     * @param {Object} keysLayout - The layout of keys for the keyboard
     */
    _initKeyboardDiv(keysLayout) {
        this.keyboardDiv = document.createElement('div');
        this.keyboardDiv.className = 'keyboard';

        const keyboardRowDivs = this._createKeyboardRowDivs(keysLayout);

        Object.values(keyboardRowDivs).forEach((rowDiv) => {
            this.keyboardDiv.appendChild(rowDiv);
        });
    };

    _createKeyboardRowDivs(keysLayout) {
        const keyboardRowDivs = {};

        for (const [letter, { row, _ }] of Object.entries(keysLayout)) {
            if (!keyboardRowDivs.hasOwnProperty(row)) {
                keyboardRowDivs[row] = this._createKeyboardRowDiv(row);
            };

            const keyDiv = this._createKeyDiv(letter);
            this.letterToKeyDiv[letter] = keyDiv;

            keyboardRowDivs[row].appendChild(keyDiv);
        };

        return keyboardRowDivs;
    };

    _createKeyboardRowDiv(row) {
        const keyboardRowDiv = document.createElement('div');
        keyboardRowDiv.className = 'keyboard__row';

        if (row == 1) {
            keyboardRowDiv.classList.add('keyboard__row-second');
        }
        if (row == 2) {
            keyboardRowDiv.classList.add('keyboard__row-third');
        };

        return keyboardRowDiv;
    };

    _createKeyDiv(letter) {
        const keyDiv = document.createElement('div');

        keyDiv.setAttribute('key-face-letter', letter);
        keyDiv.classList.add('key');
        keyDiv.textContent = letter.toUpperCase();

        return keyDiv;
    };

    /**
     * Sets up pop-up animation for the keyboard keys.
     */
    _addKeysAnimation() {
        let animationDelay;
        const keyboardRowDivs = this.keyboardDiv.querySelectorAll('.keyboard__row');

        keyboardRowDivs.forEach((rowDiv, row) => {
            // Starting animation delay for the row.
            // This essentially allows us to start the animation at
            // at the first key then propagate it diagonally across the
            // keyboard
            animationDelay = row * 0.05;

            const keyDivs = rowDiv.querySelectorAll('.key');

            keyDivs.forEach((keyDiv) => {
                keyDiv.classList.add('key-animation');
                keyDiv.style.animationDelay = `${animationDelay}s`;
                animationDelay += 0.05;
            });
        });
    };

    /**
     * Enables typing for enabled keys.
     * 
     * This means listening for user `keydown` and `keyup` events, visually
     * updating the keybaord, and publishing corresponding events via the
     * global Event Bus.
     */
    enableTyping() {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Backspace' && this.keyToCanType[e.key]) {
                publishEvent('keyboardBackspacePressed');
                return;
            };

            if (e.key == 'Enter' && this.keyToCanType[e.key]) {
                publishEvent('keyboardEnterPressed');
                return;
            };

            if (!isLetter(e.key)) return;

            const letter = this.mapQWERTYKeyToKeyboardKey(e.key.toUpperCase());

            if (this.keyToCanType[letter]) {
                this._pressKey(letter);
                publishEvent('keyboardLetterPressed', letter);
            };
        });

        document.addEventListener('keyup', (e) => {
            if (!isLetter(e.key)) return;

            const letter = this.mapQWERTYKeyToKeyboardKey(e.key.toUpperCase());

            if (this.keyToCanType[letter]) {
                this._releaseKey(letter);
            };
        });
    };

    /**
     * Updates the visual state to show a key being pressed.
     * 
     * @param {string} letter - The letter of the key to press
     */
    _pressKey(letter) {
        const keyDiv = this.letterToKeyDiv[letter];

        if (this.letterToIsHighlighed[letter]) {
            keyDiv.classList.add('key-pressed-highlighted');
        }
        else {
            keyDiv.classList.add('key-pressed');
        };
    };

    /**
     * Updates the visual state to show a key being released.
     * 
     * @param {string} letter - The letter of the key to release
     */
    _releaseKey(letter) {
        const keyDiv = this.letterToKeyDiv[letter]

        if (this.letterToIsHighlighed[letter]) {
            keyDiv.classList.remove('key-pressed-highlighted');
        }
        else {
            keyDiv.classList.remove('key-pressed');
        };
    };

    /**
     * Initializes the highlighted state of keys.
     * 
     * By default, none of the keys are highlighted.
     */
    _initHighlightedState(keysLayout) {
        for (const [letter, _] of Object.keys(keysLayout)) {
            this.letterToIsHighlighed[letter] = false;
        };
    };

    /**
     * Enable typing for the specified key when typing is enabled.
     * 
     * @param {string} key - The key to enable typing for
     */
    enableTypingKey(key) {
        if (!(key in this.keyToCanType)) {
            throw new Error(`Invalid 'key' provided = ${key}`);
        };
        this.keyToCanType[key] = true;
    };

    /**
     * Disable typing for the specified key.
     * 
     * @param {string} key - The key to disable typing for
     */
    disableTypingKey(key) {
        if (!(key in this.keyToCanType)) {
            throw new Error(`Invalid 'key' provided = ${key}`);
        };
        this.keyToCanType[key] = false;
    };

    /**
     * Sets the colour of the specified key.
     * 
     * @param {string} letter - The letter of the key to set colour for
     * @param {string} faceColour - The colour to set the key face to
     * @param {string} borderColour - The colour to set the key border to
     */
    setKeyColour(letter, faceColour, borderColour) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.style.background = faceColour;
        keyDiv.style.borderColor = borderColour;
    };

    /**
     * Resets the colour of the specified key to default.
     * 
     * @param {string} letter - The letter of the key to reset colour for
     */
    resetKeyColour(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.style.background = '';
        keyDiv.style.borderColor = '';
    };

    /**
     * Highlights the keys corresponding to the letters in the specified word.
     * 
     * @param {string} word - The word to highlight on the keyboard.
     */
    highlightWord(word) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].toUpperCase();

            const keyDiv = this.letterToKeyDiv[letter];
            keyDiv.classList.add('key-is-highlighted');

            this.letterToIsHighlighed[letter] = true;
        };
    };

    /**
     * Removes highlighting from the keys corresponding to the letters in the
     * specified word.
     * 
     * @param {string} word - The word to unhighlight on the keyboard.
     */
    unHighlightWord(word) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].toUpperCase();

            const keyDiv = this.letterToKeyDiv[letter];
            keyDiv.classList.remove('key-is-highlighted');

            this.letterToIsHighlighed[letter] = false;
        };
    };

    /**
     * Retrieves the HTML element of the keyboard.
     * 
     * @returns {HTMLElement} - The HTML element representing the keyboard.
     */
    get HTMLElement() {
        return this.keyboardDiv;
    };
};

export default Keyboard;
