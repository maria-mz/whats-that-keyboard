import { setTSEmptyState, addCharToTS, addNewLineToTS, deleteCharFromTS } from './textSpace.js';
import { lettersToLayout, getKeytoKeyMap } from './utils.js';


// TODO: placeholder for now, will get letters from database
const QWERTY_LETTERS = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];
const RAND_LETTERS = [
    'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W','Q', 'L', 'K', 'J',
    'H', 'G', 'F', 'D', 'S', 'A', 'M', 'N', 'B', 'V', 'C', 'X', 'Z'
];

const QWERTY_KEY_LAYOUT = lettersToLayout(QWERTY_LETTERS)
const RAND_KEY_LAYOUT = lettersToLayout(RAND_LETTERS);

const KEY_MAP_UPPER = getKeytoKeyMap(QWERTY_KEY_LAYOUT, RAND_KEY_LAYOUT, true);
const KEY_MAP_LOWER = getKeytoKeyMap(QWERTY_KEY_LAYOUT, RAND_KEY_LAYOUT, false);

const SPACE_KEY = ' '
const ENTER_KEY = 'Enter'
const BACKSPACE_KEY = 'Backspace'


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

    for (const [letter, { row, idx }] of Object.entries(RAND_KEY_LAYOUT)) {
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

    setTSEmptyState()
});

// Keyboard event listeners
document.addEventListener('keydown', event => {

    // --- update text space
    if (event.key === SPACE_KEY) {
        addCharToTS('\u00A0');
    }
    else if (event.key === ENTER_KEY) {
        addNewLineToTS();
    }
    else if (event.key === BACKSPACE_KEY) {
        deleteCharFromTS()
    }
    else if (event.key in KEY_MAP_LOWER) {
        addCharToTS(KEY_MAP_LOWER[event.key]);
    }
    else if (event.key in KEY_MAP_UPPER) {
        addCharToTS(KEY_MAP_UPPER[event.key]);
    }
    else {
        return;
    };

    const letter = KEY_MAP_UPPER[event.key.toUpperCase()]
    const keyLoc = RAND_KEY_LAYOUT[letter];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.add('key-pressed');

});

document.addEventListener('keyup', event => {
    const keyLoc = RAND_KEY_LAYOUT[
        KEY_MAP_UPPER[event.key.toUpperCase()]
    ];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.remove('key-pressed');

});
