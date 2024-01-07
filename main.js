const MAX_LINE_LEN = 50;
const MAX_LINES = 5;

const textSpace = document.getElementById('textSpace');
const cursor = textSpace.lastElementChild;

let userLineText = '';
let currentLine;
let numLines = 0;

// TODO: placeholder for now, will get letters from database
const lettersQWERTY = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

const lettersGen = [
    'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W','Q', 'L', 'K', 'J',
    'H', 'G', 'F', 'D', 'S', 'A', 'M', 'N', 'B', 'V', 'C', 'X', 'Z'
];


const lettersToLayout = letters => {
    const lettersCopy = [...letters]; // because .shift() modifies original array
    const keysPerRow = [10, 9, 7];  // typical keyboard layout
    const keyLayout = {};

    keysPerRow.forEach((keysPerRow, row) => {
        for (let idx = 0; idx < keysPerRow; idx++) {
            const letter = lettersCopy.shift();
            keyLayout[letter.toUpperCase()] = {row: row, idx: idx};
        };
    });

    return keyLayout;
}


const getKeytoKeyMap = (keyLayoutMapFrom, keyLayoutMapTo, isCaps) => {
    const map = {};

    for (
        const [
            letterFrom, { row: rowFrom, idx: idxFrom }
        ] of Object.entries(keyLayoutMapFrom)
    ) {
        const match = Object.entries(keyLayoutMapTo)
            .find(([_, { row: rowTo, idx: idxTo }]) =>
                rowFrom === rowTo && idxFrom === idxTo
            );

        if (match) {
            const [letterTo] = match;
            if (isCaps) {
                map[letterFrom.toUpperCase()] = letterTo.toUpperCase();
            }
            else {
                map[letterFrom.toLowerCase()] = letterTo.toLowerCase();
            };
        };
    };

    return map;
};


const keyLayoutGen = lettersToLayout(lettersGen);

const keyMapUpper = getKeytoKeyMap(lettersToLayout(lettersQWERTY), keyLayoutGen, true);
const keyMapLower = getKeytoKeyMap(lettersToLayout(lettersQWERTY), keyLayoutGen, false);


// Render keyboard.
// TODO: placeholder for now, should be done on `play game`
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded!");

    // --- create keyboard
    const createKey = (idx, letter) => {
        const key = document.createElement('div');

        key.className = 'key';
        key.textContent = letter.toUpperCase();
        key.setAttribute('idx', idx);

        return key;
    };

    const createKeyboardRow = row => {
        const keyboardRow = document.createElement('div');

        keyboardRow.className = 'keyboard__row';
        keyboardRow.id = `keyboardRow${row}`;

        return keyboardRow;
    };

    const keyboardRows = {};

    for (const [letter, { row, idx }] of Object.entries(keyLayoutGen)) {
        if (!keyboardRows.hasOwnProperty(row)) {
            keyboardRows[row] = createKeyboardRow(row);
        };

        const keyElement = createKey(idx, letter);
        keyboardRows[row].appendChild(keyElement);
    };

    const keyboard = document.getElementById('keyboard');

    Object.values(keyboardRows).forEach(keyboardRow => {
        keyboard.appendChild(keyboardRow);
    });

    // -- prepare text space
    const placeholder = document.createElement('span');
    placeholder.classList.add('text-space-placeholder');
    placeholder.textContent = 'Type away...';
    textSpace.insertBefore(placeholder, cursor);

    numLines += 1;
    currentLine = placeholder;
});

// Keyboard event listeners
document.addEventListener('keydown', event => {

    // --- update text space
    if (event.key === ' ') {
        updateTextSpace('\u00A0');
    }
    else if (event.key in keyMapLower) {
        updateTextSpace(keyMapLower[event.key]);
    }
    else if (event.key in keyMapUpper) {
        updateTextSpace(keyMapUpper[event.key]);
    }
    else {
        return;
    };

    const letter = keyMapUpper[event.key.toUpperCase()]
    const keyLoc = keyLayoutGen[letter];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.add('key-pressed');

});

document.addEventListener('keyup', event => {
    const keyLoc = keyLayoutGen[
        keyMapUpper[event.key.toUpperCase()]
    ];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.remove('key-pressed');

});


const updateTextSpace = (textChar) => {
    // TODO: think of better way to handle placeholder
    currentLine.classList.remove('text-space-placeholder');

    if (userLineText.length + 1 === MAX_LINE_LEN) {
        // on the last character for the line, add it to the current line,
        // and create a new line
        userLineText += textChar;
        currentLine.textContent = userLineText;

        currentLine = document.createElement('span');
        textSpace.insertBefore(currentLine, cursor);
        numLines += 1;
        userLineText = '';
    }
    else {
        userLineText += textChar;
        currentLine.textContent = userLineText;
    };

    if (numLines === MAX_LINES) {
        textSpace.classList.add('fade-out')
    }
    else if (numLines > MAX_LINES) {
        // remove oldest line
        const firstLine = textSpace.firstElementChild;
        firstLine.remove();
        numLines -= 1;
    };
};
