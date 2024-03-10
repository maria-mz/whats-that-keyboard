import WordInputField from "./wordInputField.js";
import WordListSectionView from "./wordListView/wordListSectionView.js";
import Keyboard from "./keyboard.js";
import TestBtn from "./testBtn.js";


/**
 * @class ViewPhaseView
 * 
 * Display for the View Phase part of the game.
 */
class ViewPhaseView {
    constructor(keysLayout, goldenWords) {
        this._inputField = new WordInputField();

        // Create word list view, where words are selectable and deletable
        this._wordList = new WordListSectionView(
            goldenWords, true, true
        );

        // Create a keyboard that shows the pop-up animation when displayed
        this._keyboard = new Keyboard(keysLayout, true);

        this._testBtn = new TestBtn();

        // Whether word input field currently shows warning text
        this._fieldShowsWarningText = false;
    };

    displayView() {
        const gameArea = document.getElementById('gameArea');
        const gameInput = document.getElementById('gameInput');

        gameArea.append(this._inputField.HTMLElement, this._wordList.HTMLElement);
        gameInput.append(this._keyboard.HTMLElement, this._testBtn.HTMLElement);

        // Enable typing only when view is displayed. Otherwise transmits events!
        this._keyboard.enableTyping();
    };

    removeView() {
        this._inputField.HTMLElement.remove();
        this._wordList.HTMLElement.remove();
        this._keyboard.HTMLElement.remove();
        this._testBtn.HTMLElement.remove();
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
