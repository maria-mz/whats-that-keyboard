import { KeyboardView } from "../views/keyboardView.js";
import { GuessableKeyboardView } from "../views/guessableKeyboardView.js";
import GameResultsView from "../views/gameResultsView.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


// Colour constants
const KEY_BG_HEX_CORRECT_GUESS = '#e4fde1';
const KEY_BORDER_HEX_CORRECT_GUESS = '#a7dca5';
const KEY_BG_HEX_WRONG_GUESS = '#ffeded';
const KEY_BORDER_HEX_WRONG_GUESS = '#ffb5b7';


/**
 * @class ResultsPhaseController
 * 
 * 
 */
class ResultsPhaseController {
    constructor(gameModel) {
        this.model = gameModel;

        subscribeEvent(
            'submitGuessBtnClicked', this._beginResultsPhase.bind(this)
        );
    };

    _beginResultsPhase() {
        this._initViews();
        this._colourKeyboards();
        this.gameEndResultsView.displayView();
    };

    _initViews() {
        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);
        const keyGuesses = this.model.getKeyGuesses();

        this.playerKeyboard = new GuessableKeyboardView(keysLayout, keyGuesses, true);
        this.correctKeyboard = new KeyboardView(keysLayout, true);
        this.gameEndResultsView = new GameResultsView(
            this.playerKeyboard.keyboardDiv,
            this.correctKeyboard.keyboardDiv,
            this.model.getNumCorrectGuesses()
        );
    };

    _colourKeyboards() {
        const keyGuesses = this.model.getKeyGuesses();

        for (const [letter, guess] of Object.entries(keyGuesses)) {
            if (letter === guess) {
                this.playerKeyboard.setKeyColour(
                    letter,
                    KEY_BG_HEX_CORRECT_GUESS,
                    KEY_BORDER_HEX_CORRECT_GUESS
                );
                this.correctKeyboard.setKeyColour(
                    letter,
                    KEY_BG_HEX_CORRECT_GUESS,
                    KEY_BORDER_HEX_CORRECT_GUESS
                );
            }
            else {
                this.playerKeyboard.setKeyColour(
                    letter,
                    KEY_BG_HEX_WRONG_GUESS,
                    KEY_BORDER_HEX_WRONG_GUESS
                );
            };
        };
    }
};

export default ResultsPhaseController;
