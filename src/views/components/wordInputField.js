import { publishEvent } from "../../eventBus.js";


/**
 * Represents the HTML component for Golden Word input.
 */
class WordInputField {
    /**
     * Creates a new `WordInputField` component.
     */
    constructor() {
        this._wordInputSection;
        this._initWordInputSection();
    };

    _initWordInputSection() {
        this._wordInputSection = document.createElement('section');
        this._wordInputSection.className = 'word-input__container';

        const instrTextContainer = this._createInstrTextContainer();
        const inputFieldDiv = this._initInputFieldDiv();

        const addWordBtnContainer = this._initAddWordBtnContainer();

        this._wordInputSection.append(
            instrTextContainer, inputFieldDiv, addWordBtnContainer
        );
    };

    _createInstrTextContainer() {
        const instrTextContainer = document.createElement('div');

        const instrTextTitle = this._createInstrTextTitle();
        const instrText = this._createInstrText();
        instrTextContainer.append(instrTextTitle, instrText)

        return instrTextContainer;
    };

    _createInstrTextTitle() {
        const instrTextTitle = document.createElement('p');
        instrTextTitle.className = 'word-input__instr-text__title'
        instrTextTitle.textContent = 'Memorize the keyboard...'

        return instrTextTitle;
    };

    _createInstrText() {
        const instrText = document.createElement('p');
        instrText.className = 'word-input__instr-text';
        instrText.innerHTML = `See the letters appear as you type them!
                               You can use this space to practice your
                               memory, or add a new Golden Word...`;

        const helpIcon = this._createHelpIcon();
        instrText.append(helpIcon);

        return instrText;
    };

    _createWarningText() {
        const warningText = document.createElement('p');
        warningText.className = 'word-input__warning-text';

        return warningText;
    };

    _initAddWordBtnContainer() {
        const addWordBtnContainer = document.createElement('div');
        addWordBtnContainer.className = 'word-input__btn-container';

        this._addWordBtn = this._createAddWordBtn();
        this._warningText = this._createWarningText();

        addWordBtnContainer.append(this._addWordBtn, this._warningText);

        return addWordBtnContainer;
    };

    _createAddWordBtn() {
        const addWordBtn = document.createElement('div');
        addWordBtn.classList.add('word-input__field-btn');
        addWordBtn.textContent = 'Add word';

        const addIcon = this._createAddWordBtnIcon();
        addWordBtn.append(addIcon);

        return addWordBtn;
    };

    _createAddWordBtnIcon() {
        const addIcon = document.createElement('i');
        addIcon.classList.add(
            'fa-solid', 'fa-arrow-right', 'word-input__btn-icon'
        );

        return addIcon;
    };

    _createHelpIcon() {
        const helpIcon = document.createElement('i');
        helpIcon.classList.add(
            'fa-regular', 'fa-circle-question', 'word-input__help-icon'
        );

        helpIcon.addEventListener('click', () => {
            publishEvent('helpBtnClicked');
        });

        return helpIcon;
    };

    enableBtn() {
        this._addWordBtn.classList.add('word-input__field-btn-enabled');
        this._addWordBtn.classList.remove('word-input__field-btn-disabled');
        this._addWordBtn.onclick = () => {
            publishEvent('addWordBtnPressed');
        };
    };

    disableBtn() {
        this._addWordBtn.classList.add('word-input__field-btn-disabled');
        this._addWordBtn.classList.remove('word-input__field-btn-enabled');
        this._addWordBtn.onclick = null;
    };

    _initInputFieldDiv() {
        const inputFieldDiv = document.createElement('div');
        inputFieldDiv.className = 'word-input__field';

        this._fieldText = document.createElement('span');
        this._fieldText.id = 'wordInputText';

        this._cursor = document.createElement('div');
        this._cursor.className = 'word-input__cursor';

        inputFieldDiv.append(this._fieldText, this._cursor);

        return inputFieldDiv;
    };

    /**
     * Get the current text content of the input field.
     * 
     * @returns {string} - The text content of the input field
     */
    get fieldText() {
        return this._fieldText.textContent;
    };

    /**
     * Set the text content of the input field. Moves the cursor accordingly.
     * 
     * @param {string} text - The text to set
     */
    set fieldText(text) {
        this._fieldText.textContent = text;

        const newWidth = this._fieldText.offsetWidth;
        this._cursor.style.transform = `translateX(${newWidth / 2}px)`;
    };

    /**
     * Set the warning text, which appears under the input field.
     * 
     * @param {string} text - The warning message
     * @param {string} word - The word associated with the warning, if any. Will
     *      be placed before `text`.
     */
    setWarningText(text, word = '') {
        if (word !== '') {
            this._warningText.innerHTML = `<strong>${word}</strong> ${text}`
        }
        else {
            this._warningText.textContent = text;
        };
    };

    /**
     * Retrieves the HTML element of the input section.
     * 
     * @returns {HTMLElement} - The input section HTML element
     */
    get HTMLElement() {
        return this._wordInputSection;
    };
};

export default WordInputField;
