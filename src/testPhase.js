import { getKeyLayout } from "./utils/KeyboardUtils.js"
import { getX, getY, moveElmtTo, boundElmtInsideWindow, sortArray } from "./utils/testPhaseUtils.js";


let gameArea = {},
    gameInput = {},
    keyGrid = {},
    keyboard = {},
    chKeyLayout = {},
    currDroppableKey = {}


function initElmts() {
    gameArea = document.getElementById('gameArea');
    gameInput = document.getElementById('gameInput');

    keyGrid = createKeyGrid();
    keyboard = createKeyboard();

    gameArea.appendChild(keyGrid);
    gameInput.appendChild(keyboard);
};

function createKeyGrid() {
    const keyGrid = document.createElement('div');

    keyGrid.id = 'keyGrid';
    keyGrid.className = 'key-grid';

    // Show letters in alphabetical order
    const sortedLetters = sortArray(Object.keys(chKeyLayout))

    sortedLetters.forEach((letter) => {
        const gridCellElmt = document.createElement('div')
    
        gridCellElmt.id = letter
        gridCellElmt.appendChild(createDraggableKey(letter))

        keyGrid.appendChild(gridCellElmt)
    });

    return keyGrid
};

function createDraggableKey(letter) {
    const draggableKey = document.createElement('div')

    draggableKey.classList.add('key');
    draggableKey.classList.add('is-draggable');
    draggableKey.textContent = letter;

    draggableKey.onmousedown = onDraggableKeyMouseDown(draggableKey)

    return draggableKey;
};

function createKeyboard() {
    const keyboard = document.createElement('div');

    keyboard.id = 'keyboard';
    keyboard.className = 'keyboard';

    Object.values(createKeyboardRows()).forEach((keyboardRow) => {
        keyboard.appendChild(keyboardRow);
    });

    return keyboard
}

function createKeyboardRows() {
    const keyboardRows = {};

    for (const [_, { row, idx }] of Object.entries(chKeyLayout)) {
        if (!keyboardRows.hasOwnProperty(row)) {
            keyboardRows[row] = createKeyboardRow(row);
        };
  
        const keyElmt = createKeyboardKey(idx);
        keyboardRows[row].appendChild(keyElmt);
    };

    return keyboardRows;
}

function createKeyboardRow(row) {
    const keyboardRow = document.createElement('div');

    keyboardRow.className = 'keyboard__row';
    keyboardRow.id = `keyboardRow${row}`;

    return keyboardRow;
};

function createKeyboardKey(idx) {
    const keyboardKey = document.createElement('div');

    keyboardKey.classList.add('key');
    keyboardKey.classList.add('is-droppable')
    keyboardKey.setAttribute('idx', idx);

    keyboardKey.onmousedown = onKeyboardKeyMouseDown(keyboardKey)

    return keyboardKey;
};

function snapKeyToKeyboard(keyboardKey, draggableKey) {
    keyboardKey.textContent = draggableKey.textContent;
    keyboardKey.style.background = "#f6f6f4";
    keyboardKey.classList.remove('is-droppable');

    draggableKey.onmousedown = null

    gameArea.removeChild(draggableKey);
}

const releaseKeyFromKeyboard = (keyboardKey) => {
    const letter = keyboardKey.textContent

    keyboardKey.textContent = ''
    keyboardKey.style.background = '#e7e7e7'
    keyboardKey.classList.add('is-droppable')

    return createDraggableKey(letter)
}

function onDraggableKeyMouseDown(draggableKey) {
    let isFirstEvent = true;

    return function(e) {
        const x = getX(draggableKey);
        const y = getY(draggableKey);

        const shiftX = e.clientX - x;
        const shiftY = e.clientY - y;

        if (isFirstEvent) {
            moveElmtTo(draggableKey, x, y);
            draggableKey.style.position = 'absolute';
            isFirstEvent = false;
        };

        gameArea.appendChild(draggableKey);

        document.onmousemove = onMouseMove(draggableKey, shiftX, shiftY);

        // `mouseup` event needs to be on document, not draggableKey, because
        // sometimes when key is picked up outside its edge, its `mouseup`
        // doesn't trigger and it continues to move
        document.onmouseup = onDocMouseUp(draggableKey);
    };
};

function onMouseMove(draggableKey, shiftX, shiftY) {
    return function(e) {
        const newX = e.pageX - shiftX
        const newY = e.pageY - shiftY

        moveElmtTo(draggableKey, newX, newY)
        boundElmtInsideWindow(draggableKey);

        // Momentarily set `display` style to 'none' to capture element below
        draggableKey.style.display = 'none';
        let elmtBelow = document.elementFromPoint(e.clientX, e.clientY);
        draggableKey.style.display = 'flex';

        if (!elmtBelow) return;

        let droppableKeyBelow = elmtBelow.closest('.is-droppable');

        if (currDroppableKey != droppableKeyBelow) {
            if (currDroppableKey) {
                // Leaving the droppable
                currDroppableKey.style.background = '';
            };

            currDroppableKey = droppableKeyBelow;

            if (currDroppableKey) {
                // Entering the droppable
                currDroppableKey.style.background = '#cdcdcd';
            };
        };
    };
};

function onDocMouseUp(draggableKey) {
    return function(e) {
        document.onmousemove = null

        if (currDroppableKey) {
            // Letting go above a spot on the keyboard
            snapKeyToKeyboard(currDroppableKey, draggableKey);
            currDroppableKey = null;
        };

        document.onmouseup = null;
    };
}

function onKeyboardKeyMouseDown(keyboardKey) {
    return function(e) {
        if (keyboardKey.classList.contains('is-droppable')) return;

        const draggableKey = releaseKeyFromKeyboard(keyboardKey);

        draggableKey.style.position = 'absolute';
        moveElmtTo(draggableKey, getX(keyboardKey), getY(keyboardKey))

        gameArea.appendChild(draggableKey);

        // 'Transfer' `onmousedown` event to the new draggable key.
        // This allows us to use only one mouse down to pick up the new key.
        // To do this, triggering an artificial event containing everything
        // needed by the event handler
        const eventCopy = new MouseEvent('mousedown', {
            clientX: e.clientX,
            clientY: e.clientY,
            pageX: e.pageX,
            pageY: e.pageY
        });

        draggableKey.dispatchEvent(eventCopy);
    };
};

function beginTestPhase(challengeLetters) {
    chKeyLayout = getKeyLayout(challengeLetters);
    currDroppableKey = null;
    initElmts();
}

export default beginTestPhase;
