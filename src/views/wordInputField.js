import { publishEvent } from "../eventBus.js";

/**
 * @class WordInputField
 * 
 * 
 */
class WordInputField {
    constructor() {
        this._initWordInputSection();
        this._updateButtonEnabledStatus();
    };

    _initWordInputSection() {
        this.wordInputSection = document.createElement('section');
        this.wordInputSection.className = 'word-input__container';

        const instrText = this._createInstrText();
        const fieldContainer = this._createFieldContainer();

        this.wordInputSection.append(instrText, fieldContainer);
    };

    _createInstrText() {
        const instrText = document.createElement('p');
        instrText.className = 'word-input__instr-text';
        instrText.textContent = `What word can help you remember
                              the placement of some keys?`;

        const helpIcon = this._createHelpIcon();

        instrText.append(helpIcon);

        return instrText;
    };

    _createWarningText() {
        const warningText = document.createElement('p');
        warningText.className = 'word-input__warning-text';

        return warningText;
    };

    _createFieldContainer() {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'word-input__field-container';

        const inputFieldDiv = this._initInputFieldDiv();

        this.addWordBtn = this._createAddWordBtn();
        this.warningText = this._createWarningText();

        fieldContainer.append(inputFieldDiv, this.addWordBtn, this.warningText);

        return fieldContainer;
    };

    _createAddWordBtn() {
        const addWordBtn = document.createElement('button');
        addWordBtn.classList.add('solid-btn', 'word-input__field-btn');

        const addIcon = this._createAddWordBtnIcon();

        addWordBtn.append(addIcon);

        return addWordBtn;
    };

    _createAddWordBtnIcon() {
        const addIcon = document.createElement('i');
        addIcon.classList.add('fa-solid', 'fa-plus');

        return addIcon;
    };

    _createHelpIcon() {
        const helpIcon = document.createElement('i');
        helpIcon.classList.add('fa-regular', 'fa-circle-question', 'word-input__help-icon');

        helpIcon.addEventListener('click', () => {
            publishEvent('helpIconClicked');
        });

        return helpIcon;
    };

    _enableBtn() {
        this.addWordBtn.classList.add('solid-btn-enabled');
        this.addWordBtn.classList.remove('solid-btn-disabled');
        this.addWordBtn.onclick = () => {
            publishEvent('addWordBtnPressed');
        };
    };

    _disableBtn() {
        this.addWordBtn.classList.add('solid-btn-disabled');
        this.addWordBtn.classList.remove('solid-btn-enabled');
        this.addWordBtn.onclick = null;
    };

    _initInputFieldDiv() {
        const inputFieldDiv = document.createElement('div');
        inputFieldDiv.className = 'word-input__field';

        this._fieldText = document.createElement('span');
        this._fieldText.id = 'wordInputText';

        const fieldCursor = document.createElement('span');
        fieldCursor.textContent = '|';
        fieldCursor.className = 'word-input__cursor';

        inputFieldDiv.append(this._fieldText, fieldCursor);

        return inputFieldDiv;
    };

    get fieldText() {
        return this._fieldText.textContent;
    };

    set fieldText(text) {
        this._fieldText.textContent = text;
        this._updateButtonEnabledStatus();
    };

    setWarningText(text) {
        this.warningText.textContent = text;
    };

    _updateButtonEnabledStatus() {
        if (this._fieldText.textContent.length === 0) {
            this._disableBtn();
        }
        else {
            this._enableBtn();
        };
    };

    get HTMLElement() {
        return this.wordInputSection;
    };
};

export default WordInputField;
