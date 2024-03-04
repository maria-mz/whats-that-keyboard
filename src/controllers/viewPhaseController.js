import WordInputView from "../views/wordInputView.js";
import WordListSectionView from "../views/wordListView/wordListSectionView.js";
import { KeyboardView } from "../views/keyboardView.js";
import TestMeBtnView from "../views/testMeBtnView.js";

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
    constructor(gameModel) {
        this.model = gameModel;

        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        this.fieldHasWarningText = false;

        this.wordInputView = new WordInputView();
        this.wordListView = new WordListSectionView(
            this.model.getUserWords(), true, true
        );
        this.keyboardView = new KeyboardView(keysLayout, true);
        this.testMeBtnView = new TestMeBtnView();

        // TODO: Display on event that starts the view phase. like 'Play' button click
        this.wordInputView.displayWordInputSection();
        this.wordListView.displayWordListSection();
        this.keyboardView.displayKeyboard();
        this.keyboardView.enableTyping();

        // Note, order matters here. Make sure to display button after
        // keyboard has been displayed.
        this.testMeBtnView.displayTestMeBtn();

        this._subscribeToEvents()
    };

    /**
     * Subscribe to events transmitted by views during View Phase
     */
    _subscribeToEvents() {
        subscribeEvent(
            'keyboardLetterPressed', this._appendCharToField.bind(this)
        );
        subscribeEvent(
            'keyboardBackspacePressed', this._deleteCharFromField.bind(this)
        );
        subscribeEvent(
            'wordListViewWordSelected', this._highlightWordOnKeyboard.bind(this)
        );
        subscribeEvent(
            'wordListViewWordDeselected', this._unHighlightWordOnKeyboard.bind(this)
        )
        subscribeEvent(
            'wordListViewWordDeleted', this._deleteWordListWord.bind(this)
        );
        subscribeEvent(
            'keyboardEnterPressed', this._addWordListWord.bind(this)
        );
        subscribeEvent(
            'addWordBtnPressed', this._addWordListWord.bind(this)
        );
        subscribeEvent(
            'testMeBtnClicked', this._clearViewPhase.bind(this)
        );
    };

    /**
     * Append a character to Word Input Field text
     * 
     * @param {string} char - the character to append
     */
    _appendCharToField(char) {
        const inputFieldText = this.wordInputView.getFieldText();
        const newText = inputFieldText + char;

        this.wordInputView.setFieldText(newText);

        if (this.fieldHasWarningText) {
            this._clearFieldWarningText();
        };
    };

    /**
     * Delete a character from Word Input Field text
     */
    _deleteCharFromField() {
        const inputFieldText = this.wordInputView.getFieldText();
        const newText = inputFieldText.slice(0, -1);

        this.wordInputView.setFieldText(newText);

        if (this.fieldHasWarningText) {
            this._clearFieldWarningText();
        };
    }

    _highlightWordOnKeyboard(word) {
        this.keyboardView.highlightWordOnKeyboard(word);
    };

    _unHighlightWordOnKeyboard(word) {
        this.keyboardView.unHighlightWordOnKeyboard(word);
    };

    /**
     * Delete a Word List word
     * 
     * @param {string} word - the word to delete
     */
    _deleteWordListWord(word) {
        this.model.deleteUserWord(word);
    };

    /**
     * Use current text of Word Input Field to add word to Word List.
     * If word goes through, clears the field
     */
    _addWordListWord() {
        const word = this.wordInputView.getFieldText();

        if (this.model.isWordInWordList(word)) {
            this.wordInputView.setWarningText('Word already in list');
            this.fieldHasWarningText = true;
            return;
        };

        // TODO: Add view handling when word is not good, with warning:
        // "Word isn't valid in this game", 

        if (this.model.addUserWord(word)) {
            this.wordInputView.setFieldText('');

            if (this.fieldHasWarningText) {
                this._clearFieldWarningText();
            };
        };
    };

    /**
     * Clear displays used during View phase
     */
    _clearViewPhase() {
        this.wordInputView.removeWordInputSection();
        this.wordListView.removeWordListSection();
        this.keyboardView.removeKeyboard();
        this.testMeBtnView.removeTestMeBtn();
    };

    _clearFieldWarningText() {
        this.wordInputView.setWarningText('');
        this.fieldHasWarningText = false;
    }
};

export default ViewPhaseController;
