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
    draggableKeyElmt.classList.add('key')
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
        // Maintains position of mouse on the key
        const shiftX = event.clientX - draggableKey.getBoundingClientRect().left;
        const shiftY = event.clientY - draggableKey.getBoundingClientRect().top;

        // Append again to make sure it appears on top of other keys
        lettersZone.appendChild(draggableKey)

        function moveAt(pageX, pageY) {
            draggableKey.style.left = pageX - shiftX + 'px';
            draggableKey.style.top = pageY - shiftY + 'px';
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

        draggableKey.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            draggableKey.onmouseup = null;

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
