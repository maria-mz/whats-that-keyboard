import WordInputField from "./mainComponents/wordInputField.js";
import WordListSection from "./mainComponents/wordListSection/wordListSection.js";
import Keyboard from "./mainComponents/keyboard.js";
import TestBtn from "./mainComponents/buttons/testBtn.js";


const EMPTY_STATE_TEXT = `<strong>Your list is empty.</strong> <br><br>To add a
                          Golden Word to your list, type it using the keyboard,
                          then click <strong>Add word</strong> or press your 
                          <strong>Enter</strong> key.`


/**
 * @class ViewPhaseView
 * 
 * Display for the View Phase part of the game.
 */
class ViewPhaseView {
    constructor(keysLayout, goldenWords) {
        this._inputField = new WordInputField();

        // Create word list view, where words are selectable and deletable,
        // and chosen empty text is shown
        this._wordList = new WordListSection(goldenWords, true, true, EMPTY_STATE_TEXT);

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

    setFieldWarning(warningText, word = '') {
        if (warningText === '') {
            this.clearFieldWarning();
            return;
        };

        this._inputField.setWarningText(warningText, word);
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

    enableAddWordBtn() {
        this._inputField._enableBtn();
    };

    disableAddWordBtn() {
        this._inputField._disableBtn();
    };
};

export default ViewPhaseView;
