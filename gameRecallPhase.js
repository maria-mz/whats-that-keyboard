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


let currKeyDroppable = null;

draggableKeys.forEach((draggableKey) => {
    // Add dragging capability

    // Adapted and expanded on the code from https://javascript.info/mouse-drag-and-drop
    draggableKey.onmousedown = function(event) {
        const shiftX = event.clientX - draggableKey.getBoundingClientRect().left;
        const shiftY = event.clientY - draggableKey.getBoundingClientRect().top;

        // Append again to make sure it appears on top of other keys
        lettersZone.appendChild(draggableKey)

        function moveAt(pageX, pageY) {
            // Get dimensions
            const elmtWidth = draggableKey.offsetWidth;
            const elmtHeight = draggableKey.offsetHeight;

            // Calculate potential new position
            let newX = pageX - shiftX;
            let newY = pageY - shiftY;

            // Adjust position to prevent scrolling
            newX = Math.max(newX, 0); // Prevent going beyond the left edge
            newY = Math.max(newY, 0); // Prevent going beyond the top edge
            newX = Math.min(newX, window.innerWidth - elmtWidth);
            newY = Math.min(newY, window.innerHeight - elmtHeight);

            draggableKey.style.left = newX + 'px';
            draggableKey.style.top = newY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            // Override `display` style to 'none' to capture element below
            draggableKey.style.display = 'none'
            let elmtBelow = document.elementFromPoint(event.clientX, event.clientY);
            // Set `display` back to original style
            draggableKey.style.display = 'flex'

            if (!elmtBelow) return;

            let keyDroppableBelow = elmtBelow.closest('.key-droppable');

            if (currKeyDroppable != keyDroppableBelow) {
                if (currKeyDroppable) {
                    leaveKeyDroppable(currKeyDroppable);
                }

                currKeyDroppable = keyDroppableBelow;

                if (currKeyDroppable) {
                    enterKeyDroppable(currKeyDroppable);
                }
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        // `mouseup` event needs to be on document, not draggableKey, because
        // sometimes when key is picked up outside its edge, its `mouseup`
        // doesn't trigger and it continues to move
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;

            if (currKeyDroppable) {
                // 'Snap' into place
                lettersZone.removeChild(draggableKey)

                currKeyDroppable.textContent = draggableKey.textContent
                currKeyDroppable.style.background = "#f6f6f4"
                currKeyDroppable.classList.remove('key-droppable')

                currKeyDroppable = null
            }
        };
    };

    function enterKeyDroppable(elmt) {
        elmt.style.background = '#cdcdcd';
    }

    function leaveKeyDroppable(elmt) {
        elmt.style.background = '';
    }
})
