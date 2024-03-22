import ViewPhaseView from "../views/viewPhaseView.js";
import { GameStage } from "../gameModel.js";

import { getKeyLayout } from "../utils/keyboardUtils.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * @class ViewPhaseController
 * 
 * Controller managing user input during the View Phase of the game.
 */
class ViewPhaseController {
    constructor(gameModel) {
        this.model = gameModel;

        const todaysLetterList = this.model.getTodaysLetterList();
        const keysLayout = getKeyLayout(todaysLetterList);

        this.view = new ViewPhaseView(keysLayout, this.model.getGoldenWords());

        if (this.model.getStage() === GameStage.MEMORIZE) {
            subscribeEvent(
                'playBtnClicked', this._beginViewPhase.bind(this)
            );
        };
    };

    _beginViewPhase() {
        this._subscribeToEvents();
        this.view.displayView();
    };

    /**
     * Subscribe to events transmitted by components of View Phase View
     */
    _subscribeToEvents() {
        subscribeEvent(
            'keyboardLetterPressed',
            this._appendCharToField.bind(this)
        );
        subscribeEvent(
            'keyboardBackspacePressed',
            this._deleteCharFromField.bind(this)
        );
        subscribeEvent(
            'wordListViewWordSelected',
            (word) => { this.view.highlightWordOnKeyboard(word); }
        );
        subscribeEvent(
            'wordListViewWordDeselected',
            (word) => { this.view.unHighlightWordOnKeyboard(word); }
        )
        subscribeEvent(
            'wordListViewWordDeleted',
            (word) => { this.model.deleteGoldenWord(word); }
        );
        subscribeEvent(
            'keyboardEnterPressed',
            this._addWordListWord.bind(this)
        );
        subscribeEvent(
            'addWordBtnPressed',
            this._addWordListWord.bind(this)
        );
        subscribeEvent(
            'testMeBtnClicked', this._concludeViewPhase.bind(this)
        );
    };

    _appendCharToField(char) {
        const fieldText = this.view.getFieldText();
        const newText = fieldText + char;

        this.view.setFieldText(newText)

        if (this.view.fieldShowsWarning()) {
            this.view.enableAddWordBtn();
            this.view.clearFieldWarning()
        };
    };

    _deleteCharFromField() {
        const fieldText = this.view.getFieldText();
        const newText = fieldText.slice(0, -1);

        this.view.setFieldText(newText);

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning()
        };
    };

    _addWordListWord() {
        const word = this.view.getFieldText();

        if (this.model.hasGoldenWord(word)) {
            this.view.setFieldWarning('is already in the list', word);
            this.view.disableAddWordBtn();
            return;
        };

        if (!this.model.isValidGoldenWord(word)) {
            this.view.setFieldWarning('isn\'t a valid word in this game', word);
            this.view.disableAddWordBtn();
            return;
        }

        this.model.addGoldenWord(word);

        this.view.setFieldText('');

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning();
        };
    };

    _concludeViewPhase() {
        this.model.setStage(GameStage.GUESS); // Set to next phase
        this.view.removeView();
    };
};

export default ViewPhaseController;
