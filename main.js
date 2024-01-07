import { putEmptyState, addChar, deleteChar } from './textSpaceManager.js';
import { lettersToLayout, getKeytoKeyMap } from './utils.js';

// TODO: placeholder for now, will get letters from database
const lettersQWERTY = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

const lettersGen = [
    'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W','Q', 'L', 'K', 'J',
    'H', 'G', 'F', 'D', 'S', 'A', 'M', 'N', 'B', 'V', 'C', 'X', 'Z'
];

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
    putEmptyState()
});

// Keyboard event listeners
document.addEventListener('keydown', event => {

    // --- update text space
    if (event.key === ' ') {
        addChar('\u00A0');
    }
    else if (event.key === 'Backspace') {
        deleteChar()
    }
    else if (event.key in keyMapLower) {
        addChar(keyMapLower[event.key]);
    }
    else if (event.key in keyMapUpper) {
        addChar(keyMapUpper[event.key]);
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
