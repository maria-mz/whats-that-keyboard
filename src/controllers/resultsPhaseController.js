import ResultsPhaseView from "../views/resultsPhaseView.js";

import { getKeyLayout } from "../utils.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * @class ResultsPhaseController
 * 
 * 
 */
class ResultsPhaseController {
    constructor(gameModel) {
        this.model = gameModel;
        this.view;

        subscribeEvent(
            'submitGuessBtnClicked', this._onSubmitGuess.bind(this)
        );
    };

    _onSubmitGuess() {
        this._initView();
        this.view.displayView();
        // TODO: Save results in model
    };

    _initView() {
        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);
        const keyGuesses = this.model.getKeyGuesses();
        const numCorrectGuesses = this.model.getNumCorrectGuesses();

        this.view = new ResultsPhaseView(keysLayout, keyGuesses, numCorrectGuesses);
    }
};

export default ResultsPhaseController;
