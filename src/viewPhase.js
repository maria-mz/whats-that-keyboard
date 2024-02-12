import beginTestPhase from './testPhase.js';
import { createWordInputSection } from './components/wordInput.js';
import { createWordListSection, createWordListItem } from './components/wordList.js';
import { createKeyboard, getKeyboardKeyByLoc } from './components/Keyboard.js';
import { getKeyLayout, getMappedLetter, isLetter, convertCharCase } from './utils/KeyboardUtils.js';


let gameArea = {},
    wordInputSection = {},
    wordInputText = {},
    wordListSection = {},
    wordListCount = {},
    wordList = {},
    gameInput = {},
    keyboard = {},
    testBtn = {},
    chLetters = [],
    keyLayout = {},
    mapToLetter


function initElmts() {
    gameArea = document.getElementById('gameArea');
    gameInput = document.getElementById('gameInput');

    initWordInput()
    initWordList()

    keyboard = createKeyboard(keyLayout)
    testBtn = createTestBtn();

    gameInput.appendChild(keyboard);
    gameInput.appendChild(testBtn);
};

function initWordInput() {
    wordInputSection = createWordInputSection();
    gameArea.appendChild(wordInputSection);
    wordInputText = document.getElementById('wordInputText');
}

function initWordList() {
    wordListSection = createWordListSection();
    gameArea.appendChild(wordListSection);
    wordList = document.getElementById('wordList');
    wordListCount = document.getElementById('wordListCount')
}

function createTestBtn() {
    const testBtn = document.createElement('div');

    testBtn.textContent = 'Test me!';
    testBtn.classList.add('btn');
    testBtn.id = 'testMeBtn';

    return testBtn;
}

function onTestBtnClick(e) {
    wordInputSection.remove();

    keyboard.remove();
    testBtn.remove();

    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);

    beginTestPhase(chLetters);
}

function onAddWordBtnClick(e) {
    const word = wordInputText.textContent;

    if (word != '') {
        wordList.appendChild(createWordListItem(word));
        // Clear input field
        wordInputText.textContent = ''
        // Increment word count
        wordListCount.textContent = Number(wordListCount.textContent) + 1;
    }
}

function onKeyDown(e) {
    if (e.key == 'Backspace') {
        wordInputText.textContent = wordInputText.textContent.slice(0, -1);
        return;
    }

    if (!isLetter(e.key)) return;

    const mappedLetter = mapToLetter(e.key.toUpperCase())

    wordInputText.textContent += convertCharCase(e.key, mappedLetter)

    const loc = keyLayout[mappedLetter];
    const keyboardKey = getKeyboardKeyByLoc(loc.row, loc.idx);

    keyboardKey.classList.add('key-pressed');
}

function onKeyUp(e) {
    if (!isLetter(e.key)) return;

    const loc = keyLayout[mapToLetter(e.key.toUpperCase())];
    const keyboardKey = getKeyboardKeyByLoc(loc.row, loc.idx);

    keyboardKey.classList.remove('key-pressed');
};

function setEventHandlers(e) {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    testBtn.addEventListener('click', onTestBtnClick);

    const addWordBtn = document.getElementById('addWordBtn');
    addWordBtn.addEventListener('click', onAddWordBtnClick);
}

function beginViewPhase(challengeLetters) {
    chLetters = challengeLetters;
    keyLayout = getKeyLayout(chLetters);
    mapToLetter = getMappedLetter(keyLayout);

    initElmts();
    setEventHandlers();
};

export default beginViewPhase;
