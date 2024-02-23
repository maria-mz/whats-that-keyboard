import { KeyboardView } from "./keyboardView.js";
import { publishEvent, subscribeEvent } from '../eventBus.js';


/**
 * Represents the hover state of a key
 * 
 * @const {object} KeyHoverState
 */
const KeyHoverState = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

// TODO: define this in one place
const NO_GUESS_STR = ''

// Colour constants
const KEY_HOVER_BG_HEX = '#cdcdcd';
const KEY_BG_HEX_CORRECT_GUESS = '#e4fde1';
const KEY_BORDER_HEX_CORRECT_GUESS = '#a7dca5';
const KEY_BG_HEX_WRONG_GUESS = '#ffeded';
const KEY_BORDER_HEX_WRONG_GUESS = '#ffb5b7';


/**
 * @class GuessableKeyboardView
 * @extends KeyboardView
 * 
 */
class GuessableKeyboardView extends KeyboardView {
    constructor(keysLayout, keyGuesses) {
        super(keysLayout);

        this._setupGuessableKeys();
        this._subscribeToEvents();

        this._updateKeyboard(keyGuesses);
    };

    _setupGuessableKeys() {
        for (const [letter, keyDiv] of Object.entries(this.letterToKeyDiv)) {
            // 1. Add event listener for removing a guess
            keyDiv.addEventListener('click', () => {
                if (this._keyHasGuess(letter)) {
                    publishEvent('keyboardViewGuessRemoved', letter);
                };
            });

            // 2. Add relevant class name
            keyDiv.classList.add('guessable-key');
        };
    };

    _keyHasGuess(letter) {
        return this.letterToKeyDiv[letter].textContent !== NO_GUESS_STR;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'keyGuessesUpdated', this._updateKeyboard.bind(this)
        );
    };

    _updateKeyboard(keyGuesses) {
        for (const [letter, guess] of Object.entries(keyGuesses)) {
            this._setKeyGuess(letter, guess);
        };
    };

    _setKeyGuess(letter, guess) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.textContent = guess;

        if (guess === NO_GUESS_STR) {
            this._hideKeyCap(letter);
        }
        else {
            this._showKeyCap(letter);
        };
    };

    _hideKeyCap(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.classList.add('key-hidden-keycap');

        this.disableTypingKey(letter);
    };

    _showKeyCap(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.classList.remove('key-hidden-keycap');

        this.enableTypingKey(letter);
    };

    setKeyHoverState(letter, state) {
        const keyDiv = this.letterToKeyDiv[letter];

        if (state === KeyHoverState.ACTIVE) {
            keyDiv.style.background = KEY_HOVER_BG_HEX;
        }
        else if (state === KeyHoverState.INACTIVE) {
            keyDiv.style.background = '';
        }
        else {
            throw new Error(`Invalid 'KeyHoverState' = ${state}`);
        };
    };

    colourKeyboardByGuesses() {
        for (const [letter, keyDiv] of Object.entries(this.letterToKeyDiv)) {
            const guess = keyDiv.textContent;

            if (guess === NO_GUESS_STR) continue;

            if (guess === letter) {
                keyDiv.style.background = KEY_BG_HEX_CORRECT_GUESS;
                keyDiv.style.borderColor = KEY_BORDER_HEX_CORRECT_GUESS;
            }
            else {
                keyDiv.style.background = KEY_BG_HEX_WRONG_GUESS;
                keyDiv.style.borderColor = KEY_BORDER_HEX_WRONG_GUESS;
            };
        };
    };
};

export { GuessableKeyboardView, KeyHoverState };
