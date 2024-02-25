import {
    getMappedLetter,
    isLetter,
    convertCharCase
} from '../utils.js';

import { publishEvent } from '../eventBus.js';

/**
 * @class KeyboardView
 * 
 * 
 */
class KeyboardView {
    constructor(keysLayout) {
        this.letterToKeyDiv = {};
        this.keyToCanType = {};
        this.mapRegKeyLetter = getMappedLetter(keysLayout);

        this._initKeyboardDiv(keysLayout);
        this._initDefaultTyping();
    };

    _initDefaultTyping() {
        Object.keys(this.letterToKeyDiv).forEach((letter) => {
            this.keyToCanType[letter] = true;
        });

        this.keyToCanType['Enter'] = true;
        this.keyToCanType['Backspace'] = true;
    };

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
                keyboardRowDivs[row] = this._createKeyboardRowDiv();
            };

            const keyDiv = this._createKeyDiv(letter);
            this.letterToKeyDiv[letter] = keyDiv;

            keyboardRowDivs[row].appendChild(keyDiv);
        };

        return keyboardRowDivs;
    };

    _createKeyboardRowDiv() {
        const keyboardRowDiv = document.createElement('div');
        keyboardRowDiv.className = 'keyboard__row';

        return keyboardRowDiv;
    };

    _createKeyDiv(letter) {
        const keyDiv = document.createElement('div');

        keyDiv.setAttribute('key-face-letter', letter);
        keyDiv.classList.add('key');
        keyDiv.textContent = letter.toUpperCase();

        return keyDiv;
    };

    displayKeyboard() {
        const gameInputSection = document.getElementById('gameInput');
        gameInputSection.appendChild(this.keyboardDiv);
    };

    removeKeyboard() {
        this.keyboardDiv.remove();
    };

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

            const letter = this.mapRegKeyLetter(e.key.toUpperCase());

            if (this.keyToCanType[letter]) {
                this._pressKey(letter);

                publishEvent(
                    'keyboardLetterPressed', convertCharCase(e.key, letter)
                );
            };
        });

        document.addEventListener('keyup', (e) => {
            if (!isLetter(e.key)) return;

            const letter = this.mapRegKeyLetter(e.key.toUpperCase());

            if (this.keyToCanType[letter]) {
                this._releaseKey(letter);
            };
        });
    };

    _pressKey(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.classList.add('key-pressed');
    };

    _releaseKey(letter) {
        const keyDiv = this.letterToKeyDiv[letter]
        keyDiv.classList.remove('key-pressed');
    };

    enableTypingKey(key) {
        if (!(key in this.keyToCanType)) {
            throw new Error(`Invalid 'key' provided = ${key}`);
        };
        this.keyToCanType[key] = true;
    };

    disableTypingKey(key) {
        if (!(key in this.keyToCanType)) {
            throw new Error(`Invalid 'key' provided = ${key}`);
        };
        this.keyToCanType[key] = false;
    };

    setKeyColour(letter, face_bg, border_bg) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.style.background = face_bg;
        keyDiv.style.borderColor = border_bg;
    };

    resetKeyColour(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.style.background = '';
        keyDiv.style.borderColor = '';
    };
};

export { KeyboardView };
