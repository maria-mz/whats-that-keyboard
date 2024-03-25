import WordInputField from "./mainComponents/wordInputField.js";
import WordListSection from "./mainComponents/wordListSection/wordListSection.js";
import Keyboard from "./mainComponents/keyboard.js";
import TestBtn from "./mainComponents/buttons/testBtn.js";


const LIST_EMPTY_STATE = `<strong>Your list is empty.</strong> <br><br>To add a
                          Golden Word to the list, type it using the keyboard,
                          then click <strong>Add word</strong> or press your 
                          <strong>Enter</strong> key.`


/**
 * Display for the View Phase of the game.
 */
class ViewPhaseView {
    /**
     * Creates an instance of `ViewPhaseView`.
     * 
     * @param {object} keysLayout - The layout of keys for the keyboard
     * @param {string[]} goldenWords - The list of Golden Words
     */
    constructor(keysLayout, goldenWords) {
        this._inputField = new WordInputField();
        this._wordList = new WordListSection(goldenWords, true, true, LIST_EMPTY_STATE);
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
        this._inputField.enableBtn();
    };

    disableAddWordBtn() {
        this._inputField.disableBtn();
    };
};

export default ViewPhaseView;
