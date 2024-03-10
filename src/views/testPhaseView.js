import WordListSection from "./mainComponents/wordListSection/wordListSection.js";
import { GuessableKeyboard, KeyHoverState } from "./mainComponents/guessableKeyboard.js";
import GuessingKeysGrid from "./mainComponents/guessingKeysGrid.js";
import SubmitGuessBtn from "./mainComponents/buttons/submitGuessBtn.js";


/**
 * @class TestPhaseView
 * 
 * Display for the View Phase part of the game.
 */
class TestPhaseView {
    constructor(keysLayout, keyGuesses, goldenWords) {
        // Create guessing keys grid that shows pop-up animation on display
        this._guessingKeysGrid = new GuessingKeysGrid(keyGuesses, true);

        // Create a guessable keyboard, that doesn't show the pop-up
        // animation on display
        // TODO: Display keyboard aligned with model progress
        this._keyboard = new GuessableKeyboard(keysLayout, keyGuesses, false);

        // Create word list view, where words cannot be selected nor deleted
        this._wordList = new WordListSection(goldenWords, false, false);

        // TODO: enable true or false depending on progress from model,
        // for now assumes first-time view, no keys placed, so disable btn
        // (true for dev)
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
