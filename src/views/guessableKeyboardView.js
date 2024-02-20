import { KeyboardView } from "./keyboardView.js";
import { publishEvent, subscribeEvent } from '../eventBus.js';


/**
 * Represents the current visibility of a keycap on a key
 * 
 * @const {object} KeycapVisibility
 */
const KeycapVisibility = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden'
};

/**
 * Represents the current hover state of a key
 * 
 * @const {object} KeyHoverState
 */
const KeyHoverState = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};


/**
 * @class GuessableKeyboardView
 * @extends KeyboardView
 * 
 */
class GuessableKeyboardView extends KeyboardView {
    constructor(keysLayout, keyGuesses) {
        super(keysLayout);

        this.letterToCapVis = {};
        this.letterToHoverState = {};

        this._initHoverState();
        this._initClickPublishing();
        this._subscribeToEvents();

        this._updateKeyboard(keyGuesses);
    };

    _initHoverState() {
        Object.keys(this.letterToKeyDiv).forEach((letter) => {
            this.letterToHoverState[letter] = KeyHoverState.INACTIVE
        });
    };

    _initClickPublishing() {
        for (const [letter, keyDiv] of Object.entries(this.letterToKeyDiv)) {
            keyDiv.addEventListener('click', () => {
                publishEvent('keyboardKeyClicked', letter);
            });
        };
    };

    _subscribeToEvents() {
        subscribeEvent(
            'keyGuessesUpdated', this._updateKeyboard.bind(this)
        );
    };

    _updateKeyboard(keyGuesses) {
        for (const [letter, guess] of Object.entries(keyGuesses)) {
            this._setKeyGuess(letter, guess);

            if (guess === '') {
                this._setKeyVisibility(letter, KeycapVisibility.HIDDEN);
            }
            else {
                this._setKeyVisibility(letter, KeycapVisibility.VISIBLE);
            };
        };
    };

    _setKeyVisibility(letter, visibility) {
        const keyDiv = this.letterToKeyDiv[letter];

        if (visibility === KeycapVisibility.VISIBLE) {
            keyDiv.classList.remove('key-is-hidden');
            this.enableTypingKey(letter);
        }
        else if (visibility === KeycapVisibility.HIDDEN) {
            keyDiv.classList.add('key-is-hidden');
            this.disableTypingKey(letter);
        }
        else {
            throw new Error(`Invalid 'KeycapVisibility' = ${visibility}`);
        };

        this.letterToCapVis[letter] = visibility;
    };

    _setKeyGuess(letter, guess) {
        const keyDiv = this.letterToKeyDiv[letter];
        keyDiv.textContent = guess;
    };

    setKeyHoverState(letter, state) {
        const keyDiv = this.letterToKeyDiv[letter];

        if (state === KeyHoverState.ACTIVE) {
            keyDiv.style.background = '#cdcdcd';
        }
        else if (state === KeyHoverState.INACTIVE) {
            keyDiv.style.background = '';
        }
        else {
            throw new Error(`Invalid 'KeyHoverState' = ${state}`);
        };

        this.letterToHoverState[letter] = state;
    };
};

export { GuessableKeyboardView, KeycapVisibility, KeyHoverState };
