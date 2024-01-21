import { lettersToLayout } from './utils.js';
import renderKeyboard from './renderKeyboard.js';
import CHALLENGE_LETTERS from './challengeLetters.js';


// Render keyboard but don't show letters
renderKeyboard(lettersToLayout(CHALLENGE_LETTERS), false);


const lettersZone = document.getElementById('lettersZone');

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
 * Transfers the content of the dragged key to the specified keyboard key.
 * 
 * @param {HTMLElement} keyboardKey - the target keyboard key
 * @param {HTMLElement} draggableKey - the dragged key
 */
const snapKeyToKeyboard = (keyboardKey, draggableKey) => {
    // -- update keyboard key styles
    keyboardKey.textContent = draggableKey.textContent
    keyboardKey.style.background = "#f6f6f4"
    keyboardKey.classList.remove('key-droppable')
}


/**
 * Releases the specified key from the keyboard, creating a new draggable key.
 * 
 * @param {HTMLElement} keyboardKey - the keyboard key to release
 * @returns {HTMLElement} - the newly created draggable key
 */
const releaseKeyFromKeyboard = (keyboardKey) => {
    // -- create new draggable key with styles
    const draggableKey = document.createElement('div')
    draggableKey.textContent = keyboardKey.textContent
    draggableKey.classList.add('key-draggable')

    // -- update keyboard key styles
    keyboardKey.textContent = ''
    keyboardKey.style.background = '#e7e7e7'
    keyboardKey.classList.add('key-droppable')

    return draggableKey
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
            snapKeyToKeyboard(currKeyDroppable, draggableKey);

            // -- remove draggable key
            draggableKey.onmousedown = null
            lettersZone.removeChild(draggableKey)

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


const keyboardElmt = document.getElementById('keyboard');
const keyboardKeys = keyboardElmt.querySelectorAll('.key')


keyboardKeys.forEach((keyboardKey) => {
    keyboardKey.classList.add('key-droppable')

    keyboardKey.onmousedown = (event) => {
        if (keyboardKey.classList.contains('key-droppable')) return;

        // If reached here, means there is a key in this location.
        // Release the key
        const draggableKey = releaseKeyFromKeyboard(keyboardKey)

        lettersZone.appendChild(draggableKey)

        // Appending new element moves its location, we want to keep it in same
        // position as keyboard key, to give effect of picking it up
        draggableKey.style.left = keyboardKey.getBoundingClientRect().left + 'px'
        draggableKey.style.top = keyboardKey.getBoundingClientRect().top +'px'

        draggableKey.onmousedown = (event) => {
            onDraggableKeyMouseDown(draggableKey, event)
        }
        // 'Transfer' `onmousedown` event to the new draggable key.
        // This allows us to use only one mouse down to pick up the new key.
        // To do this, triggering an artificial event containing everything
        // needed by the event handler
        const newEvent = new MouseEvent('mousedown', {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY
        });

        draggableKey.dispatchEvent(newEvent);
    }
})
