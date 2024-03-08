import TestPhaseView from "../views/testPhaseView.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


// TODO: define this in one place
const NO_GUESS_STR = ''


/**
 * @class TestPhaseController
 * 
 * Controller managing user input during the Test Phase of the game.
 */
class TestPhaseController {
    constructor(gameModel) {
        this.model = gameModel;
        
        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        this.view = new TestPhaseView(
            keysLayout, this.model.getKeyGuesses(), this.model.getUserWords()
        );

        subscribeEvent(
            'testMeBtnClicked', this._beginTestPhase.bind(this)
        );
    };

    _beginTestPhase() {
        this.view.displayView();
        this._subscribeToTestPhaseEvents();
    };

    /**
     * Subscribe to events transmitted by components of Test Phase View
     */
    _subscribeToTestPhaseEvents() {
        subscribeEvent(
            'guessingKeyEnteredGuessableKey',
            this._putHoverOnKeyboardKey.bind(this)
        );
        subscribeEvent(
            'guessingKeyLeftGuessableKey',
            this._removeHoverOnKeyboardKey.bind(this)
        );
        subscribeEvent(
            'guessingKeyReleasedOnGuessableKey',
            this._updateGuess.bind(this)
        );
        subscribeEvent(
            'keyboardViewGuessRemoved',
            this._removeKeyGuess.bind(this)
        );
        subscribeEvent(
            'submitGuessBtnClicked',
            () => { this.view.removeView(); }
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
    _putHoverOnKeyboardKey(msg) {
        this.view.putHoverOnKeyboardKey(msg.letterOfGuessableKey);
    };

    /**
     * Handles the event when a guessing key has just stopped hovering
     * over a guessable key on the keyboard.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfGuessingKey
     * @param {string} msg.letterOfGuessableKey
     */
    _removeHoverOnKeyboardKey(msg) {
        this.view.removeHoverOnKeyboardKey(msg.letterOfGuessableKey);
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
        // Make sure hover is removed if it currently has the effect
        this.view.removeHoverOnKeyboardKey(msg.letterOfGuessableKey);

        const letterToGuess = msg.letterOfGuessableKey
        const guess = msg.letterOfGuessingKey

        this.model.updateKeyGuess(letterToGuess, guess);

        this._updateSubmitGuessBtn();
    };

    _updateSubmitGuessBtn() {
        if (this.model.isGameOver()) {
            this.view.enableSubmitBtn();
        }
        else {
            this.view.disableSubmitBtn();
        };
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
        this._updateSubmitGuessBtn();
    };
};

export default TestPhaseController;
