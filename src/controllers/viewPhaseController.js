
import ViewPhaseView from "../views/viewPhaseView.js";

import { getKeyLayout } from "../utils.js";
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

        this.view = new ViewPhaseView(keysLayout, this.model.getUserWords());

        subscribeEvent(
            'playBtnClicked', this._beginViewPhase.bind(this)
        );
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
            (word) => { this.model.deleteUserWord(word); }
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
            'testMeBtnClicked',
            () => { this.view.removeView(); }
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

        if (this.model.isWordInWordList(word)) {
            this.view.setFieldWarning('That word is already in the list');
            this.view.disableAddWordBtn();
            return;
        };

        if (!this.model.isWordValid(word)) {
            this.view.setFieldWarning('Hmm... that word isn\'t valid in this game');
            this.view.disableAddWordBtn();
            return;
        }

        this.model.addUserWord(word);

        this.view.setFieldText('');

        if (this.view.fieldShowsWarning()) {
            this.view.clearFieldWarning();
        };
    };
};

export default ViewPhaseController;
