import beginTestPhase from './testPhase.js';
import { createKeyboard, getKeyboardKeyByLoc } from './components/Keyboard.js';
import { getKeyLayout, getMappedLetter, isLetter } from './utils/KeyboardUtils.js';

let gameArea = {},
    gameInput = {},
    keyboard = {},
    testBtn = {},
    chLetters = [],
    keyLayout = {},
    mapToLetter

function initElmts() {
    gameArea = document.getElementById('gameArea');
    gameInput = document.getElementById('gameInput');

    keyboard = createKeyboard(keyLayout)
    testBtn = createTestBtn();

    gameInput.appendChild(keyboard);
    gameInput.appendChild(testBtn);
};

function createTestBtn() {
    const testBtn = document.createElement('div');

    testBtn.textContent = 'Test me!';
    testBtn.classList.add('btn');
    testBtn.id = 'testMeBtn';

    testBtn.addEventListener('click', (e) => {
        keyboard.remove();

        testBtn.click = null;
        testBtn.remove();

        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);

        beginTestPhase(chLetters);
    });

    return testBtn;
}

function onKeyDown(e) {
    if (!isLetter(e.key)) return;

    const loc = keyLayout[mapToLetter(e.key.toUpperCase())];
    const keyboardKey = getKeyboardKeyByLoc(loc.row, loc.idx);

    keyboardKey.classList.add('key-pressed');
}

function onKeyUp(e) {
    if (!isLetter(e.key)) return;

    const loc = keyLayout[mapToLetter(e.key.toUpperCase())];
    const keyboardKey = getKeyboardKeyByLoc(loc.row, loc.idx);

    keyboardKey.classList.remove('key-pressed');
};

function beginViewPhase(challengeLetters) {
    chLetters = challengeLetters;
    keyLayout = getKeyLayout(chLetters);
    mapToLetter = getMappedLetter(keyLayout);

    initElmts();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
};

export default beginViewPhase;
