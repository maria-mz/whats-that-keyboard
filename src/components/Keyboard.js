function createKeyboard(keyLayout) {
    const keyboard = document.createElement('div');

    keyboard.id = 'keyboard';
    keyboard.className = 'keyboard';

    Object.values(createKeyboardRows(keyLayout)).forEach((keyboardRow) => {
        keyboard.appendChild(keyboardRow);
    });

    return keyboard;
};

function createKeyboardRows(keyLayout) {
    const keyboardRows = {};

    for (const [letter, { row, idx }] of Object.entries(keyLayout)) {
        if (!keyboardRows.hasOwnProperty(row)) {
            keyboardRows[row] = createKeyboardRow(row);
        };
  
        const keyElmt = createKeyboardKey(idx, letter);
        keyboardRows[row].appendChild(keyElmt);
    };

    return keyboardRows;
};

function createKeyboardRow(row) {
    const keyboardRow = document.createElement('div');

    keyboardRow.className = 'keyboard__row';
    keyboardRow.id = `keyboardRow${row}`;

    return keyboardRow;
};

function createKeyboardKey(idx, letter) {
    const keyboardKey = document.createElement('div');

    keyboardKey.classList.add('key');
    keyboardKey.textContent = letter.toUpperCase();
    keyboardKey.setAttribute('idx', idx);

    return keyboardKey;
};

function getKeyboardKeyByLoc(row, idx) {
    return document.getElementById(`keyboardRow${row}`)
        .querySelector(`[idx="${idx}"]`);
};

export { createKeyboard, getKeyboardKeyByLoc };
