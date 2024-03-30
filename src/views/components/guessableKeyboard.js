import Keyboard from './keyboard.js';
import { publishEvent, subscribeEvent } from '../../eventBus.js';
import { NO_GUESS_STR } from '../../constants.js';


/**
 * Represents the hover state of a key.
 * 
 * @const {object} KeyHoverState
 */
const KeyHoverState = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const KEY_HOVER_BG_HEX = '#cdcdcd';


/**
 * Represents a guessable keyboard HTML component.
 * 
 * A `GuessableKeyboard` is a `Keyboard`, but is hoverable and its keys can
 * be 'guessed'. Keys with a guess are shown, otherwise they are hidden.
 */
class GuessableKeyboard extends Keyboard {
    /**
     * Creates a new `GuessableKeyboard` component.
     * 
     * @param {object} keysLayout - The layout of keys for the keyboard
     * @param {object} keyGuesses - The initial letter to guess mapping
     * @param {boolean} showAnim - Whether to show pop-up animation on display
     */
    constructor(keysLayout, keyGuesses, showAnim) {
        super(keysLayout, showAnim);

        this._setupGuessableKeys();
        this._subscribeToEvents();

        this._updateKeyboard(keyGuesses);
    };

    /**
     * Sets up the keys of the keyboard to be 'guessable' keys.
     */
    _setupGuessableKeys() {
        for (const [letter, keyDiv] of Object.entries(this.letterToKeyDiv)) {
            keyDiv.addEventListener('mousedown', () => {
                if (this._keyHasGuess(letter)) {
                    publishEvent('keyboardViewGuessRemoved', letter);
                };
            });

            // This helps guessing keys target these elements
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

    /**
     * Updates the display of the keyboard to reflect the key guesses.
     * 
     * @param {object} keyGuesses - The letter to guess mapping
     */
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

    /**
     * Sets the hover state for the specified key.
     * 
     * @param {string} letter - The letter of the key
     * @param {string} state - The hover state to set
     */
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
};

export { GuessableKeyboard, KeyHoverState };
