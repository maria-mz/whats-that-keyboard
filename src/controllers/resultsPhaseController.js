import ResultsPhaseView from "../views/resultsPhaseView.js";
import { GameStage } from "../gameModel.js";

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

        if (this.model.getStage() === GameStage.RESULTS) {
            subscribeEvent(
                'playBtnClicked', this._beginResultsPhase.bind(this)
            );
        } else {
            subscribeEvent(
                'submitGuessBtnClicked', this._beginResultsPhase.bind(this)
            );
        };
    };

    _beginResultsPhase() {
        this._initView();
        this.view.displayView();
    };

    _initView() {
        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);
        const keyGuesses = this.model.getKeyGuesses();
        const gameScore = this.model.getGameScore();

        this.view = new ResultsPhaseView(keysLayout, keyGuesses, gameScore);
    };
};

export default ResultsPhaseController;
