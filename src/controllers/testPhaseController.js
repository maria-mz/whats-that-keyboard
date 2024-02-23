import WordListView from "../views/wordListView.js";
import { GuessableKeyboardView, KeyHoverState } from "../views/guessableKeyboardView.js";
import { GuessingKeysView } from "../views/guessingKeysView.js";
import SubmitGuessBtnView from "../views/submitGuessBtnView.js";

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
    constructor(gameModel) {
        this.model = gameModel;

        subscribeEvent(
            'testMeBtnClicked', this._beginTestPhase.bind(this)
        );
    };

    _beginTestPhase() {
        this._initViews();
        this._displayViews();
        this._subscribeToTestPhaseEvents();
    };

    _initViews() {
        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        // TODO: Display guessing keys aligned with model progress
        this.guessingKeysView = new GuessingKeysView(
            todaysLetterList, this.model.getKeyGuesses()
        );
        // TODO: Display keyboard aligned with model progress
        this.keyboardView = new GuessableKeyboardView(
            keysLayout, this.model.getKeyGuesses()
        );
        // TODO: Display words saved in model
        this.wordListView = new WordListView();
        // TODO: enable true or false depending on progress from model,
        // for now assumes first-time view, no keys placed, so disable btn
        this.submitGuessBtnView = new SubmitGuessBtnView(false);
    };

    _displayViews() {
        this.keyboardView.displayKeyboard();
        this.keyboardView.enableTyping();
        this.guessingKeysView.displayKeysGrid();
        this.wordListView.displayWordListSection(this.model.getUserWordsSet());
        // Note, order matters here. Make sure to display button after
        // keyboard has been displayed.
        this.submitGuessBtnView.displayBtn();
    };

    /**
     * Subscribe to events transmitted by views during Test Phase
     */
    _subscribeToTestPhaseEvents() {
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
