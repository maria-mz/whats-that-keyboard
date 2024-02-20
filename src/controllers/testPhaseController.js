import WordListView from "../views/wordListView.js";
import { GuessableKeyboardView, KeyHoverState } from "../views/guessableKeyboardView.js";
import { DraggableKeysView } from "../views/draggableKeysView.js";

import GameModel from "../gameModel.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


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
        this._initDraggableKeysView(todaysLetterList);
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

    _initDraggableKeysView(todaysLetterList) {
        // TODO: Display draggable keys aligned with model progress
        this.draggableKeysView = new DraggableKeysView(
            todaysLetterList, this.model.getKeyGuesses()
        );
        this.draggableKeysView.displayDraggableKeysGrid();
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
            'draggableKeyLeftKeyboardKey',
            this._onDraggableKeyLeftKeyboardKey.bind(this)
        );
        subscribeEvent(
            'draggableKeyEnteredKeyboardKey',
            this._onDraggableKeyEnteredKeyboardKey.bind(this)
        );
        subscribeEvent(
            'draggableKeyLetGoAboveKeyboardKey',
            this._onDraggableKeyLetGoAboveKeyboardKey.bind(this)
        );
        subscribeEvent(
            'keyboardKeyClicked',
            this._onKeyboardKeyClicked.bind(this)
        );
    };

    /**
     * Handles the event when a draggable key has just started hovering
     * over a key on the keyboard.
     * 
     * Adds an effect on the keyboard key to indicate a potential
     * drop spot.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfDraggableKey
     * @param {string} msg.letterOfKeyboardKey
     */
    _onDraggableKeyEnteredKeyboardKey(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfKeyboardKey, KeyHoverState.ACTIVE
        );
    };

    /**
     * Handles the event when a draggable key has just stopped hovering
     * over a key on the keyboard.
     * 
     * Removes the effect on the keyboard key that indicated a potential
     * drop spot.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfDraggableKey
     * @param {string} msg.letterOfKeyboardKey
     */
    _onDraggableKeyLeftKeyboardKey(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfKeyboardKey, KeyHoverState.INACTIVE
        );
    };

    /**
     * Handles the event when a draggable key is released over a
     * key on the keyboard.
     * 
     * This is considered making progress in the game. The
     * draggable key letter is the player's guess at the real
     * keyboard key letter.
     * 
     * Updates the game model.
     * 
     * @param {Object} msg - letters of keys involved in this interaction
     * @param {string} msg.letterOfDraggableKey
     * @param {string} msg.letterOfKeyboardKey
     */
    _onDraggableKeyLetGoAboveKeyboardKey(msg) {
        this.keyboardView.setKeyHoverState(
            msg.letterOfKeyboardKey, KeyHoverState.INACTIVE
        );
        this.model.updateKeyGuess(
            msg.letterOfKeyboardKey, msg.letterOfDraggableKey
        );
    };

    /**
     * Handles the event when a keyboard key is clicked.
     * 
     * This is considered removing the key placed by the user
     * on the keyboard. By default, if the user hasn't made
     * a guess for a letter, the guess is the empty sring.
     * 
     * Updates the game model.
     * 
     * @param {string} letterOfKeyboardKey
     */
    _onKeyboardKeyClicked(letterOfKeyboardKey) {
        this.model.updateKeyGuess(letterOfKeyboardKey, '');
    };
};

export default TestPhaseController;
