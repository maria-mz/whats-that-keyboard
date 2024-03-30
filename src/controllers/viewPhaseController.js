import ViewPhaseView from "../views/viewPhaseView.js";
import { GameStage } from "../gameModel.js";

import { getKeyLayout } from "../utils/keyboardUtils.js";
import { subscribeEvent } from "../eventBus.js";


/**
 * Manages user input and display for the View Phase of the game.
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
        this.view.disableAddWordBtn();
    };

    /**
     * Subscribe to events transmitted by components of View Phase View
     */
    _subscribeToEvents() {
        subscribeEvent(
            'keyboardLetterPressed', this._appendCharToField.bind(this)
        );
        subscribeEvent(
            'keyboardBackspacePressed', this._deleteCharFromField.bind(this)
        );
        subscribeEvent(
            'wordListViewWordSelected', (word) => { this.view.highlightWordOnKeyboard(word); }
        );
        subscribeEvent(
            'wordListViewWordDeselected', (word) => { this.view.unHighlightWordOnKeyboard(word); }
        )
        subscribeEvent(
            'wordListViewWordDeleted', (word) => { this.model.deleteGoldenWord(word); }
        );
        subscribeEvent(
            'keyboardEnterPressed', this._addGoldenWordInput.bind(this)
        );
        subscribeEvent(
            'addWordBtnPressed', this._addGoldenWordInput.bind(this)
        );
        subscribeEvent(
            'testMeBtnClicked', this._concludeViewPhase.bind(this)
        );
    };

    _appendCharToField(char) {
        if (!char) {
            return;
        };

        const fieldText = this.view.getFieldText();
        const newText = fieldText + char;

        this.view.setFieldText(newText);

        if (this.model.meetsMinWordLength(newText)) {
            this.view.enableAddWordBtn();
        };

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning();
            this.view.enableAddWordBtn();
        };
    };

    _deleteCharFromField() {
        const fieldText = this.view.getFieldText();
        const newText = fieldText.slice(0, -1);

        this.view.setFieldText(newText);

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning();
            this.view.enableAddWordBtn();
        };

        if (!this.model.meetsMinWordLength(newText)) {
            this.view.disableAddWordBtn();
        };
    };

    _addGoldenWordInput() {
        const word = this.view.getFieldText();

        if (!this.model.meetsMinWordLength(word)) {
            return;
        };

        if (this.model.hasGoldenWord(word)) {
            this.view.setFieldWarning('already in list', word);
            this.view.disableAddWordBtn();
            return;
        };

        if (!this.model.isInWordBank(word)) {
            this.view.setFieldWarning('not in word bank', word);
            this.view.disableAddWordBtn();
            return;
        };

        this.model.addGoldenWord(word);

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning();
        };

        this.view.setFieldText('');
        this.view.disableAddWordBtn();
    };

    _concludeViewPhase() {
        this.model.setStage(GameStage.GUESS); // Set to next phase
        this.view.removeView();
    };
};

export default ViewPhaseController;
