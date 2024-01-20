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
    const keyPaddingElmt = document.createElement('div')
    keyPaddingElmt.className = 'key-padding'

    const draggableKeyElmt = document.createElement('div')
    draggableKeyElmt.classList.add('key-draggable')
    draggableKeyElmt.textContent = letter

    keyPaddingElmt.appendChild(draggableKeyElmt)

    lettersZone.appendChild(keyPaddingElmt)
});


const draggableKeys = lettersZone.querySelectorAll('.key-padding');


let currKeyDroppable = null;

draggableKeys.forEach((draggableKey) => {
    // Add dragging capability

    // Adapted from https://javascript.info/mouse-drag-and-drop
    draggableKey.onmousedown = function(event) {
        // Maintains position of mouse on the key
        let shiftX = event.clientX - draggableKey.getBoundingClientRect().left;
        let shiftY = event.clientY - draggableKey.getBoundingClientRect().top;

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
        };
    };

    function enterKeyDroppable(elmt) {
        elmt.style.background = '#9BA7C0';
        // TODO: snap to place when lets go
    }

    function leaveKeyDroppable(elmt) {
        elmt.style.background = '';
    }
})
