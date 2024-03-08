import { getMappedLetter, isLetter } from '../utils.js';
import { publishEvent } from '../eventBus.js';


/**
 * @class KeyboardView
 * 
 * 
 */
class KeyboardView {
    constructor(keysLayout, showAnimationOnDisplay) {
        this.letterToKeyDiv = {};
        this.letterToIsHighlighed = {};
        this.keyToCanType = {};
        this.mapRegKeyLetter = getMappedLetter(keysLayout);

        this._initKeyboardDiv(keysLayout);
        this._initDefaultTyping();
        this._initHighlightedState(keysLayout);

        if (showAnimationOnDisplay) {
            this._addKeysAnimation();
        };
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
                publishEvent('keyboardLetterPressed', letter);
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

        if (this.letterToIsHighlighed[letter]) {
            keyDiv.classList.add('key-pressed-highlighted');
        }
        else {
            keyDiv.classList.add('key-pressed');
        };
    };

    _releaseKey(letter) {
        const keyDiv = this.letterToKeyDiv[letter]

        if (this.letterToIsHighlighed[letter]) {
            keyDiv.classList.remove('key-pressed-highlighted');
        }
        else {
            keyDiv.classList.remove('key-pressed');
        };
    };

    _initHighlightedState(keysLayout) {
        for (const [letter, _] of Object.keys(keysLayout)) {
            this.letterToIsHighlighed[letter] = false;
        };
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

    highlightWord(word) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].toUpperCase();

            const keyDiv = this.letterToKeyDiv[letter];
            keyDiv.classList.add('key-is-highlighted');

            this.letterToIsHighlighed[letter] = true;
        };
    };

    unHighlightWord(word) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i].toUpperCase();

            const keyDiv = this.letterToKeyDiv[letter];
            keyDiv.classList.remove('key-is-highlighted');

            this.letterToIsHighlighed[letter] = false;
        };
    };

    get HTMLElement() {
        return this.keyboardDiv;
    };
};

export { KeyboardView };
