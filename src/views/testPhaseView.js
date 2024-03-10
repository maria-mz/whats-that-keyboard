import WordListSectionView from "./wordListView/wordListSectionView.js";
import { GuessableKeyboard, KeyHoverState } from "./guessableKeyboard.js";
import { GuessingKeysView } from "./guessingKeysView.js";
import SubmitGuessBtn from "./submitGuessBtn.js";


/**
 * @class TestPhaseView
 * 
 * Display for the View Phase part of the game.
 */
class TestPhaseView {
    constructor(keysLayout, keyGuesses, goldenWords) {
        // Create guessing keys component that shows pop-up animation on display
        this._guessingKeys = new GuessingKeysView(keyGuesses, true);

        // Create a guessable keyboard, that doesn't show the pop-up
        // animation on display
        // TODO: Display keyboard aligned with model progress
        this._keyboard = new GuessableKeyboard(keysLayout, keyGuesses, false);

        // Create word list view, where words cannot be selected nor deleted
        this._wordList = new WordListSectionView(goldenWords, false, false);

        // TODO: enable true or false depending on progress from model,
        // for now assumes first-time view, no keys placed, so disable btn
        // (true for dev)
        this._submitBtn = new SubmitGuessBtn(true);
    };

    displayView() {
        // TODO: these components should not handle displaying themselves.
        // this view class should get their HTML element, and handle
        // appending to document.
        this._guessingKeys.displayKeysGrid();
        this._keyboard.displayKeyboard();
        this._wordList.displayWordListSection();
        // Note, order matters here. Make sure to display button after
        // keyboard has been displayed.
        this._submitBtn.displayBtn();

        this._keyboard.enableTyping();
    };

    removeView() {
        this._guessingKeys.removeKeysGrid();
        this._guessingKeys.removeGuessingKeys();
        this._keyboard.removeKeyboard();
        this._wordList.removeWordListSection();
        this._submitBtn.removeBtn();
    };

    enableSubmitBtn() {
        this._submitBtn.enableBtn();
    };

    disableSubmitBtn() {
        this._submitBtn.disableBtn();
    };

    putHoverOnKeyboardKey(letter) {
        this._keyboard.setKeyHoverState(letter, KeyHoverState.ACTIVE);
    };

    removeHoverOnKeyboardKey(letter) {
        this._keyboard.setKeyHoverState(letter, KeyHoverState.INACTIVE);
    };

};

export default TestPhaseView;
