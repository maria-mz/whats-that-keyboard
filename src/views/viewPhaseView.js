import WordInputView from "./wordInputView.js";
import WordListSectionView from "./wordListView/wordListSectionView.js";
import { KeyboardView } from "./keyboardView.js";
import TestBtn from "./testBtn.js";


/**
 * @class ViewPhaseView
 * 
 * Display for the View Phase part of the game.
 */
class ViewPhaseView {
    constructor(keysLayout, goldenWords) {
        this._inputField = new WordInputView();

        // Create word list view, where words are selectable and deletable
        this._wordList = new WordListSectionView(
            goldenWords, true, true
        );

        // Create a keyboard that shows the pop-up animation when displayed
        this._keyboard = new KeyboardView(keysLayout, true);

        this._testBtn = new TestBtn();

        // Whether word input field currently shows warning text
        this._fieldShowsWarningText = false;
    };

    displayView() {
        // TODO: these components should not handle displaying themselves.
        // this view class should get their HTML element, and handle
        // appending to document.
        this._inputField.displayWordInputSection();
        this._wordList.displayWordListSection();
        this._keyboard.displayKeyboard();
        // Note, order matters here. Make sure to display button after
        // keyboard has been displayed.
        this._testBtn.displayTestMeBtn();

        this._keyboard.enableTyping();
    };

    removeView() {
        this._inputField.removeWordInputSection();
        this._wordList.removeWordListSection();
        this._keyboard.removeKeyboard();
        this._testBtn.removeTestMeBtn();
    };

    setFieldText(newText) {
        this._inputField.fieldText = newText;
    };

    getFieldText() {
        return this._inputField.fieldText;
    };

    clearFieldWarning() {
        this._inputField.setWarningText('');
        this._fieldShowsWarningText = false;
    };

    setFieldWarning(warningText) {
        if (warningText === '') {
            this.clearFieldWarning();
            return;
        }

        this._inputField.setWarningText(warningText);
        this._fieldShowsWarningText = true;
    };

    fieldShowsWarning() {
        return this._fieldShowsWarningText;
    };

    highlightWordOnKeyboard(word) {
        this._keyboard.highlightWord(word);
    };

    unHighlightWordOnKeyboard(word) {
        this._keyboard.unHighlightWord(word);
    };
};

export default ViewPhaseView;
