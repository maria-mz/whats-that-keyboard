import { createKeyboard } from "./components/Keyboard.js";
import { getKeyLayout } from "./utils/KeyboardUtils.js"
import { getX, getY, moveElmtTo, boundElmtInsideWindow, sortArray } from "./utils/testPhaseUtils.js";


let gameArea = {},
    gameInput = {},
    keyGrid = {},
    keyboard = {},
    keyLayout = {},
    currDroppableKey = {}


function initElmts() {
    gameArea = document.getElementById('gameArea');
    gameInput = document.getElementById('gameInput');

    keyGrid = createKeyGrid();
    keyboard = createKeyboard(keyLayout);
    setupKeyboardKeys();

    gameArea.appendChild(keyGrid);
    gameInput.appendChild(keyboard);
};

function createKeyGrid() {
    const keyGrid = document.createElement('div');

    keyGrid.id = 'keyGrid';
    keyGrid.className = 'key-grid';

    // Show letters in alphabetical order
    const sortedLetters = sortArray(Object.keys(keyLayout))

    sortedLetters.forEach((letter) => {
        const gridCellElmt = document.createElement('div');
    
        gridCellElmt.id = letter;
        gridCellElmt.appendChild(createDraggableKey(letter));

        keyGrid.appendChild(gridCellElmt);
    });

    return keyGrid;
};

function createDraggableKey(letter) {
    const draggableKey = document.createElement('div');

    draggableKey.classList.add('key', 'is-draggable');
    draggableKey.textContent = letter;

    draggableKey.onmousedown = onDraggableKeyMouseDown(draggableKey);

    return draggableKey;
};

function setupKeyboardKeys() {
    const keyboardKeys = keyboard.querySelectorAll('.key');

    keyboardKeys.forEach((key) => {
        key.classList.add('is-droppable');
        key.textContent = '';
        key.onmousedown = onKeyboardKeyMouseDown(key);
    });
};

function snapKeyToKeyboard(keyboardKey, draggableKey) {
    keyboardKey.textContent = draggableKey.textContent;
    keyboardKey.style.background = '#ffffff';
    keyboardKey.classList.remove('is-droppable');

    draggableKey.onmousedown = null;

    draggableKey.remove();
};

const releaseKeyFromKeyboard = (keyboardKey) => {
    const letter = keyboardKey.textContent;

    keyboardKey.textContent = '';
    keyboardKey.style.background = '#e7e7e7';
    keyboardKey.classList.add('is-droppable');

    return createDraggableKey(letter);
};

function onDraggableKeyMouseDown(draggableKey) {
    let isFirstEvent = true;

    return function(e) {
        const x = getX(draggableKey);
        const y = getY(draggableKey);

        if (isFirstEvent) {
            // Update coordinates to the same position, prevents key from
            // jumping to top left corner
            moveElmtTo(draggableKey, x, y);

            // This allows key to be held + moved around
            draggableKey.style.position = 'absolute';

            // Remove draggable key from the grid.
            // Need to append to document body and not `gameArea`, since
            // it has relative positioning which makes updating key's
            // coordinates more complicated.
            // But document body makes sense, since you can move this key
            // anywhere on the page
            document.body.append(draggableKey);
            isFirstEvent = false;
        };


        // These shifts ensure that when the element moves, it stays where it
        // was picked up by the cursor. Otherwise it will jump to be centered
        // under the cursor
        const shiftX = e.clientX - x;
        const shiftY = e.clientY - y;

        document.onmousemove = onMouseMove(draggableKey, shiftX, shiftY);

        // `mouseup` event needs to be on document, not draggableKey, because
        // sometimes when key is picked up outside its edge, its `mouseup`
        // doesn't trigger and it continues to move
        document.onmouseup = onDocMouseUp(draggableKey);
    };
};

function onMouseMove(draggableKey, shiftX, shiftY) {
    return function(e) {
        const newX = e.pageX - shiftX;
        const newY = e.pageY - shiftY;

        moveElmtTo(draggableKey, newX, newY);
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
        document.onmousemove = null;

        if (currDroppableKey) {
            // Letting go above a spot on the keyboard
            snapKeyToKeyboard(currDroppableKey, draggableKey);
            currDroppableKey = null;
        };

        document.onmouseup = null;
    };
};

function onKeyboardKeyMouseDown(keyboardKey) {
    return function(e) {
        if (keyboardKey.classList.contains('is-droppable')) return;

        const draggableKey = releaseKeyFromKeyboard(keyboardKey);

        draggableKey.style.position = 'absolute';
        moveElmtTo(draggableKey, getX(keyboardKey), getY(keyboardKey))

        document.body.append(draggableKey);

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
    keyLayout = getKeyLayout(challengeLetters);
    currDroppableKey = null;

    initElmts();
}

export default beginTestPhase;
