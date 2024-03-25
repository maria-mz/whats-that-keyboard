import WordListSection from "./mainComponents/wordListSection/wordListSection.js";
import { GuessableKeyboard, KeyHoverState } from "./mainComponents/guessableKeyboard.js";
import GuessingKeysGrid from "./mainComponents/guessingKeysGrid.js";
import SubmitGuessBtn from "./mainComponents/buttons/submitGuessBtn.js";


/**
 * Display for the Test Phase of the game.
 */
class TestPhaseView {
    /**
     * Creates an instance of `TestPhaseView`.
     * 
     * @param {object} keysLayout - The layout of keys for the keyboard
     * @param {object} keyGuesses - The inital letter to guess mapping
     * @param {string[]} goldenWords - The list of Golden Words
     */
    constructor(keysLayout, keyGuesses, goldenWords) {
        this._guessingKeysGrid = new GuessingKeysGrid(keyGuesses, true);
        this._keyboard = new GuessableKeyboard(keysLayout, keyGuesses, false);
        this._wordList = new WordListSection(goldenWords, false, false, '');
        this._submitBtn = new SubmitGuessBtn(true);
    };

    displayView() {
        const gameArea = document.getElementById('gameArea');
        const gameInput = document.getElementById('gameInput');

        gameArea.append(this._guessingKeysGrid.HTMLElement, this._wordList.HTMLElement);
        gameInput.append(this._keyboard.HTMLElement, this._submitBtn.HTMLElement);

        // Enable typing only when view is displayed. Otherwise transmits events!
        this._keyboard.enableTyping();
    };

    removeView() {
        this._guessingKeysGrid.HTMLElement.remove();
        this._guessingKeysGrid.removeGuessingKeys();
        this._keyboard.HTMLElement.remove();
        this._wordList.HTMLElement.remove();
        this._submitBtn.HTMLElement.remove();
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
