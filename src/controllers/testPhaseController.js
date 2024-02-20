import WordListView from "../views/wordListView.js";
import { GuessableKeyboardView, KeyHoverState } from "../views/guessableKeyboardView.js";
import { GuessingKeysView } from "../views/guessingKeysView.js";

import GameModel from "../gameModel.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


// TODO: define this in one place
const NO_GUESS_STR = ''


/**
 * @class TestPhaseController
 * 
 * Controller for managing user input and view output during
 * the Test Phase of the game.
 * 
 * Listens for input events from views and responds accordingly,
 * which may involve updating the game model or view.
 */
class TestPhaseController {
    constructor() {
        this.model = new GameModel();

        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        this._initKeyboardView(keysLayout);
        this._initGuessingKeysView(todaysLetterList);
        this._initWordsListView();

        this._subscribeToEvents();
    };

    _initKeyboardView(keysLayout) {
        // TODO: Display keyboard aligned with model progress
        this.keyboardView = new GuessableKeyboardView(
            keysLayout, this.model.getKeyGuesses()
        );

        this.keyboardView.displayKeyboard();
        this.keyboardView.enableTyping();
    };

    _initGuessingKeysView(todaysLetterList) {
        // TODO: Display guessing keys aligned with model progress
        this.guessingKeysView = new GuessingKeysView(
            todaysLetterList, this.model.getKeyGuesses()
        );
        this.guessingKeysView.displayFreeKeysGrid();
    };

    _initWordsListView() {
        // TODO: Display words saved in model
        this.wordListView = new WordListView();
        this.wordListView.displayWordListSection();
    }

    /**
     * Subscribe to events transmitted by views during Test Phase
     */
    _subscribeToEvents() {
        subscribeEvent(
            'guessingKeyEnteredGuessableKey',
            this._setGuessableKeyHover.bind(this)
        );
        subscribeEvent(
            'guessingKeyLeftGuessableKey',
            this._removeGuessableKeyHover.bind(this)
        );
        subscribeEvent(
            'guessingKeyReleasedOnGuessableKey',
            this._updateGuess.bind(this)
        );
        subscribeEvent(
            'keyboardViewGuessRemoved',
            this._removeKeyGuess.bind(this)
        );
    };

    /**
     * Handles the event when a guessing key has just started hovering
     * over a guessable key on the keyboard.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfGuessingKey
     * @param {string} msg.letterOfGuessableKey
     */
    _setGuessableKeyHover(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfGuessableKey, KeyHoverState.ACTIVE
        );
    };

    /**
     * Handles the event when a guessing key has just stopped hovering
     * over a guessable key on the keyboard.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfGuessingKey
     * @param {string} msg.letterOfGuessableKey
     */
    _removeGuessableKeyHover(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfGuessableKey, KeyHoverState.INACTIVE
        );
    };

    /**
     * Handles the event when a guessing key is released over a guessable
     * key the keyboard.
     * 
     * This is considered making progress in the game. The guessing key
     * letter is the player's guess at the real guessable key letter.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfGuessingKey
     * @param {string} msg.letterOfGuessableKey
     */
    _updateGuess(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfGuessableKey, KeyHoverState.INACTIVE
        );
        this.model.updateKeyGuess(
            msg.letterOfGuessableKey, msg.letterOfGuessingKey
        );
    };

    /**
     * Handles the event when a guessable key that has a guess, is clicked.
     * 
     * This is considered removing the guess made for that key.
     * 
     * @param {string} letterOfGuessableKey
     */
    _removeKeyGuess(letterOfGuessableKey) {
        this.model.updateKeyGuess(letterOfGuessableKey, NO_GUESS_STR);
    };
};

export default TestPhaseController;
