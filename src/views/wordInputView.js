import { publishEvent } from "../eventBus.js";

/**
 * @class WordInputView
 * 
 * 
 */
class WordInputView {
    constructor() {
        this._initWordInputSection();
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
        instrText.textContent = 'What words can help you remember ' +
                                'the placement of keys?';

        instrText.className = 'word-input__instr-text';

        return instrText;
    };

    _createFieldContainer() {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'word-input__field-container';

        const inputFieldDiv = this._initInputFieldDiv();

        const addWordBtn = this._createAddWordBtn();
        addWordBtn.addEventListener('click', () => {
            publishEvent('addWordBtnPressed');
        });

        fieldContainer.append(inputFieldDiv, addWordBtn);

        return fieldContainer;
    };

    _createAddWordBtn() {
        const addWordBtn = document.createElement('button');
        addWordBtn.textContent = '+';
        addWordBtn.id = 'addWordBtn';
        addWordBtn.className = 'word-input__add-btn';

        return addWordBtn;
    };

    _initInputFieldDiv() {
        const inputFieldDiv = document.createElement('div');
        inputFieldDiv.className = 'word-input__field';

        this.fieldText = document.createElement('span');
        this.fieldText.id = 'wordInputText';

        const fieldCursor = document.createElement('span');
        fieldCursor.textContent = '|';
        fieldCursor.className = 'word-input__cursor';

        inputFieldDiv.append(this.fieldText, fieldCursor);

        return inputFieldDiv;
    };

    displayWordInputSection() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.wordInputSection);
    };

    removeWordInputSection() {
        this.wordInputSection.remove();
    };

    setFieldText(text) {
        this.fieldText.textContent = text;
    };

    getFieldText() {
        return this.fieldText.textContent;
    };
};

export default WordInputView;
