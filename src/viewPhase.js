import TextSpace from './components/TextSpace.js';
import Keyboard from './components/Keyboard.js';
import beginTestPhase from './testPhase.js';


let gameArea = {},
    gameInput = {},
    textSpace = {},
    keyboard = {},
    testBtn = {},
    chLetters = []


function initElmts() {
    gameArea = document.getElementById('gameArea');
    gameInput = document.getElementById('gameInput');

    textSpace = new TextSpace();
    keyboard = new Keyboard(textSpace, chLetters);

    gameArea.appendChild(textSpace.getTextSpaceElmt());
    gameInput.appendChild(keyboard.getKeyboardElmt());

    testBtn = createTestBtn();
    gameInput.appendChild(testBtn);
};

function createTestBtn() {
    const testBtn = document.createElement('div');

    testBtn.textContent = 'Test me!';
    testBtn.classList.add('btn');
    testBtn.id = 'testMeBtn';

    testBtn.addEventListener('click', (e) => {
        textSpace.getTextSpaceElmt().remove()
        keyboard.getKeyboardElmt().remove()
    
        testBtn.click = null;
        testBtn.remove()

        beginTestPhase(chLetters)
    });

    return testBtn;
}

function beginViewPhase(challengeLetters) {
    chLetters = challengeLetters

    initElmts();

    document.addEventListener('keydown', keyboard.keydownEventHandler.bind(keyboard))
    document.addEventListener('keyup', keyboard.keyupEventHandler.bind(keyboard))
}


export default beginViewPhase;
