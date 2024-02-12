function createWordInputSection() {
    const wordInputSection = document.createElement('section');
    wordInputSection.className = 'word-input__container';

    const instrText = document.createElement('p');
    instrText.textContent = 'What words can help you remember the placement of keys?';
    instrText.className = 'word-input__instr-text';

    const fieldContainer = createFieldContainer();

    wordInputSection.appendChild(instrText);
    wordInputSection.appendChild(fieldContainer);

    return wordInputSection;
};

function createFieldContainer() {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'word-input__field-container';

    const field = createWordInputField()

    const addWordBtn = document.createElement('button');
    addWordBtn.textContent = '+';
    addWordBtn.id = 'addWordBtn';
    addWordBtn.className = 'word-input__add-btn';

    fieldContainer.appendChild(field);
    fieldContainer.appendChild(addWordBtn);

    return fieldContainer;
};

function createWordInputField() {
    const field = document.createElement('div');
    field.className = 'word-input__field';

    const fieldText = document.createElement('span');
    fieldText.textContent = '';     // Initially empty
    fieldText.id = 'wordInputText';

    const fieldCursor = document.createElement('span');
    fieldCursor.textContent = '|';
    fieldCursor.className = 'word-input__cursor';

    field.appendChild(fieldText);
    field.appendChild(fieldCursor);

    return field;
};


export { createWordInputSection };
