const renderKeyboard = (layout, showLetter) => {
    const keyboardRowElmts = {};

    for (const [letter, { row, idx }] of Object.entries(layout)) {
        if (!keyboardRowElmts.hasOwnProperty(row)) {
            keyboardRowElmts[row] = createKeyboardRowElmt(row);
        };

        const keyElmt = createKeyElmt(idx, letter, showLetter);
        keyboardRowElmts[row].appendChild(keyElmt);
    };

    const keyboardElmt = document.getElementById('keyboard');

    Object.values(keyboardRowElmts).forEach(keyboardRow => {
        keyboardElmt.appendChild(keyboardRow);
    });
};


// -- helper functions
const createKeyElmt = (idx, letter, showLetter) => {
    const keyElmt = document.createElement('div');

    keyElmt.className = 'key';

    if (showLetter) {
        keyElmt.textContent = letter.toUpperCase();
    }
    else {
        keyElmt.textContent = '';
    };
    keyElmt.setAttribute('idx', idx);

    return keyElmt;
};

const createKeyboardRowElmt = (row) => {
    const keyboardRowElmt = document.createElement('div');

    keyboardRowElmt.className = 'keyboard__row';
    keyboardRowElmt.id = `keyboardRow${row}`;

    return keyboardRowElmt;
};


export { renderKeyboard };
