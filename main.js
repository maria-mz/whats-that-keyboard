import { setTSEmptyState, addCharToTS, addNewLineToTS, deleteCharFromTS } from './textSpace.js';
import { lettersToLayout, getKeytoKeyMap } from './utils.js';
import CHALLENGE_LETTERS from './challengeLetters.js';
import renderKeyboard from './renderKeyboard.js';


const QWERTY_LETTERS = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

const QWERTY_LAYOUT = lettersToLayout(QWERTY_LETTERS)
const CHALLENGE_LAYOUT = lettersToLayout(CHALLENGE_LETTERS);

const KEY_MAP_UPPER = getKeytoKeyMap(QWERTY_LAYOUT, CHALLENGE_LAYOUT, true);
const KEY_MAP_LOWER = getKeytoKeyMap(QWERTY_LAYOUT, CHALLENGE_LAYOUT, false);


const SPACE_KEY = ' '
const ENTER_KEY = 'Enter'
const BACKSPACE_KEY = 'Backspace'


renderKeyboard(CHALLENGE_LAYOUT, true)
setTSEmptyState()


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
    const keyLoc = CHALLENGE_LAYOUT[letter];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.add('key-pressed');

});

document.addEventListener('keyup', event => {
    const keyLoc = CHALLENGE_LAYOUT[
        KEY_MAP_UPPER[event.key.toUpperCase()]
    ];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    keyElement.classList.remove('key-pressed');

});
