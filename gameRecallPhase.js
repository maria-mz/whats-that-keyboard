import { lettersToLayout } from './utils.js';
import renderKeyboard from './renderKeyboard.js';
import CHALLENGE_LETTERS from './challengeLetters.js';


// Render keyboard but don't show letters
renderKeyboard(lettersToLayout(CHALLENGE_LETTERS), false);


const lettersZone = document.getElementById('lettersZone');
const keyboardElmt = document.getElementById('keyboard');

const keyboardKeys = keyboardElmt.querySelectorAll('.key')
keyboardKeys.forEach((key) => {
    key.classList.add('key-droppable')
});


// Render letters zone
CHALLENGE_LETTERS.forEach((letter) => {
    const draggableKeyElmt = document.createElement('div')
    draggableKeyElmt.classList.add('key-draggable')
    draggableKeyElmt.textContent = letter

    lettersZone.appendChild(draggableKeyElmt)
});


const draggableKeys = lettersZone.querySelectorAll('.key-draggable');



const enterKeyDroppable = (elmt) => {
    elmt.style.background = '#cdcdcd';
}

const leaveKeyDroppable = (elmt) => {
    elmt.style.background = '';
}

/**
 * Adjusts the position of an element to keep it within the visible
 * area of the window.
 * 
 * @param {HTMLElement} elmt - element to be adjusted
 * @param {number} x - x-coordinate of `elmt`
 * @param {number} y - y-coordinate of `elmt`
 */
const boundElmtInsideWindow = (elmt, x, y) => {
    let boundedX;
    let boundedY;

    if (x < 0) {
        // Prevents going outside Left edge
        boundedX = 0
    } else {
        // Prevents going outside Right edge
        const maxX = window.innerWidth - elmt.offsetWidth
        boundedX = Math.min(x, maxX);
    }

    if (y < 0) {
        // Prevents going outside Top edge
        boundedY = 0
    } else {
        // Prevents going outside Bottom edge
        const maxY = window.innerHeight - elmt.offsetHeight
        boundedY = Math.min(y, maxY);
    }

    elmt.style.left = boundedX + 'px';
    elmt.style.top = boundedY + 'px';
}

/**
 * Updates the keyboard with the content of the dragged key.
 */
const snapToKeyboard = (keyboardKey, draggableKey) => {
    // -- update keyboard key styles
    keyboardKey.textContent = draggableKey.textContent
    keyboardKey.style.background = "#f6f6f4"
    keyboardKey.classList.remove('key-droppable')

    // -- remove draggable key, as it has been transferred to the keyboard
    lettersZone.removeChild(draggableKey)
    draggableKey.onmousedown = null
}


const onDraggableKeyMouseDown = (draggableKey, event) => {
    // Adapted and expanded on the code from https://javascript.info/mouse-drag-and-drop

    // Capture mouse's position on the key.
    // When moving, shift by this amount to keep mouse on same part of the key
    const shiftX = event.clientX - draggableKey.getBoundingClientRect().left;
    const shiftY = event.clientY - draggableKey.getBoundingClientRect().top;

    // Append again to make sure it appears on top of other draggable keys
    lettersZone.appendChild(draggableKey);

    function onMouseMove(event) {
        let newX = event.pageX - shiftX;
        let newY = event.pageY - shiftY;

        boundElmtInsideWindow(draggableKey, newX, newY);

        // Override `display` style to 'none' to capture element below
        draggableKey.style.display = 'none';

        let elmtBelow = document.elementFromPoint(event.clientX, event.clientY);

        // Set `display` back to original style
        draggableKey.style.display = 'flex';

        if (!elmtBelow) return;

        let keyDroppableBelow = elmtBelow.closest('.key-droppable');

        if (currKeyDroppable != keyDroppableBelow) {
            if (currKeyDroppable) {
                leaveKeyDroppable(currKeyDroppable);
            };

            currKeyDroppable = keyDroppableBelow;

            if (currKeyDroppable) {
                enterKeyDroppable(currKeyDroppable);
            };
        };
    };

    document.addEventListener('mousemove', onMouseMove);

    // `mouseup` event needs to be on document, not draggableKey, because
    // sometimes when key is picked up outside its edge, its `mouseup`
    // doesn't trigger and it continues to move
    document.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);

        if (currKeyDroppable) {
            // We're above a key on the keyboard, 'snap' this draggable key into place
            snapToKeyboard(currKeyDroppable, draggableKey);
            currKeyDroppable = null;
        };

        document.onmouseup = null;
    };
};


let currKeyDroppable = null;

draggableKeys.forEach((draggableKey) => {
    draggableKey.onmousedown = (event) => {
        onDraggableKeyMouseDown(draggableKey, event);
    };
});
