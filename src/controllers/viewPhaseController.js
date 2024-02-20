import WordInputView from "../views/wordInputView.js";
import WordListView from "../views/wordListView.js";
import { KeyboardView } from "../views/keyboardView.js";

import GameModel from "../gameModel.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * @class ViewPhaseController
 * 
 * Controller for managing user input and view output during
 * the View Phase of the game.
 * 
 * Listens for input events from views and responds accordingly,
 * which may involve updating the game model or view.
 */
class ViewPhaseController {
    constructor() {
        this.model = new GameModel();

        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        this.wordInputView = new WordInputView();
        this.wordListView = new WordListView();
        this.keyboardView = new KeyboardView(keysLayout);

        this.wordInputView.displayWordInputSection();
        // TODO: Display words saved in model
        this.wordListView.displayWordListSection();
        this.keyboardView.displayKeyboard();
        this.keyboardView.enableTyping();

        this._subscribeToEvents()
    };

    /**
     * Subscribe to events transmitted by views during View Phase
     */
    _subscribeToEvents() {
        subscribeEvent(
            'keyboardLetterPressed',
            this._onKeyboardLetterPressed.bind(this)
        );
        subscribeEvent(
            'keyboardBackspacePressed',
            this._onKeyboardBackspacePressed.bind(this)
        );
        subscribeEvent(
            'wordListViewWordDeleted',
            this._onWordListViewWordDeleted.bind(this)
        );
        subscribeEvent(
            'keyboardEnterPressed',
            this._addWordListWord.bind(this)
        );
        subscribeEvent(
            'addWordBtnPressed',
            this._addWordListWord.bind(this)
        );
    };

    /**
     * Handles the event when a letter key is pressed on
     * the keyboard view.
     * 
     * Updates the input field text to include the new letter.
     * 
     * @param {string} letter - the letter associated with key press
     */
    _onKeyboardLetterPressed(letter) {
        const inputFieldText = this.wordInputView.getFieldText();
        const newText = inputFieldText + letter;

        this.wordInputView.setFieldText(newText);
    };

    _onKeyboardBackspacePressed() {
        const inputFieldText = this.wordInputView.getFieldText();
        const newText = inputFieldText.slice(0, -1);

        this.wordInputView.setFieldText(newText);
    }

    /**
     * Handles the event when player deletes a word in the
     * word list view.
     * 
     * Deletes the word in the game model.
     * 
     * @param {string} word - the deleted word
     */
    _onWordListViewWordDeleted(word) {
        this.model.deleteUserWord(word);
    };

    /**
     * Handles an event that means adding a new word to the
     * word list. Currently this happens if:
     * 
     *     1. The '+' button in the word input view is pressed
     *     2. The 'Enter' key is pressed on keyboard
     * 
     * Updates the model to add the word currently in the
     * input field. If update succeeds, clears the input field.
     */
    _addWordListWord() {
        const inputFieldText = this.wordInputView.getFieldText();

        if (this.model.addUserWord(inputFieldText)) {
            this.wordInputView.setFieldText('')
        }
    };
};

export default ViewPhaseController;
