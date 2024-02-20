import { 
    getX,
    getY,
    moveElmtTo,
    boundElmtInsideWindow,
    sortArray
} from "../utils.js";

import { publishEvent, subscribeEvent } from '../eventBus.js';


/**
 * Represents the current general location of a draggable key
 * 
 * @const {object} DraggableKeyLocation
 */
const DraggableKeyLocation = {
    GRID: "grid",
    KEYBOARD: 'keyboard',
    DOCUMENT: "document"
};

/**
 * Represents the current visibility a draggable key
 * 
 * @const {object} DraggableKeyVisibility
 */
const DraggableKeyVisibility = {
    VISIBLE: "visible",
    HIDDEN: "hidden"
};


/**
 * @class DraggableKeysView
 * 
 */
class DraggableKeysView {
    constructor(letters, keyGuesses) {
        this.letterToKeyDiv = {};
        this.letterToKeyLoc = {};
        this.letterToKeyVis = {};

        this.currKeyboardKey = null;

        this._initDraggableKeys(letters);
        this._subscribeToEvents();

        this._updateDraggableKeys(keyGuesses);
    };

    _initDraggableKeys(letters) {
        const sortedLetters = sortArray(letters);

        sortedLetters.forEach((letter) => {
            const draggableKeyDiv = this._createDraggableKeyDiv(letter);
            this.letterToKeyDiv[letter] = draggableKeyDiv;
            this._enableDrag(letter);
        });

        // Draggable keys start off belonging to a grid
        this.keyGridDiv = this._createKeyGridDiv()
    };

    _createDraggableKeyDiv(letter) {
        const draggableKeyDiv = document.createElement('div');
        draggableKeyDiv.classList.add('key', 'is-draggable');
        draggableKeyDiv.textContent = letter;

        return draggableKeyDiv;
    };

    _createKeyGridDiv() {
        const keyGridDiv = document.createElement('div');
        keyGridDiv.classList.add('key-grid');
        keyGridDiv.id = 'keyGrid';

        for (const [letter, draggableKeyDiv] of Object.entries(this.letterToKeyDiv)) {
            const cellDiv = document.createElement('div');
            cellDiv.id = `cell${letter}`;
            cellDiv.append(draggableKeyDiv);

            keyGridDiv.append(cellDiv);

            this.letterToKeyLoc[letter] = DraggableKeyLocation.GRID;
        }

        return keyGridDiv;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'keyGuessesUpdated', this._updateDraggableKeys.bind(this)
        );
    };

    _enableDrag(letter) {
        const draggableKey = this.letterToKeyDiv[letter];

        draggableKey.onmousedown = (e) => {
            const x = getX(draggableKey);
            const y = getY(draggableKey);

            const keyLoc = this.letterToKeyLoc[letter];

            if (keyLoc === DraggableKeyLocation.GRID) {
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

                this.letterToKeyLoc[letter] = DraggableKeyLocation.DOCUMENT;
            };

            // These shifts ensure that when the element moves, it stays where it
            // was picked up by the cursor. Otherwise it will jump to be centered
            // under the cursor
            const shiftX = e.clientX - x;
            const shiftY = e.clientY - y;

            this._initOnDocMouseMove(letter, shiftX, shiftY);
            this._initOnDocMouseUp(letter);
        };
    };

    _initOnDocMouseMove(letter, shiftX, shiftY) {
        const draggableKey = this.letterToKeyDiv[letter];

        document.onmousemove = (e) => {
            // Move the key
            const newX = e.pageX - shiftX;
            const newY = e.pageY - shiftY;

            moveElmtTo(draggableKey, newX, newY);
            boundElmtInsideWindow(draggableKey);

            // Check if hovering over a keyboard key
            const elmtBelow = this._getElementBelow(draggableKey, e.clientX, e.clientY);

            if (!elmtBelow) return;

            const keyboardKeyBelow = elmtBelow.closest('.keyboard-key');

            // Handle possible interaction
            if (this.currKeyboardKey != keyboardKeyBelow) {
                if (this.currKeyboardKey) {
                    this._publishInteraction('draggableKeyLeftKeyboardKey', letter);
                };

                this.currKeyboardKey = keyboardKeyBelow;

                if (this.currKeyboardKey) {
                    this._publishInteraction('draggableKeyEnteredKeyboardKey', letter);
                };
            };
        };
    };

    _getElementBelow(elmt, x, y) {
        elmt.style.display = 'none';
        const elmtBelow = document.elementFromPoint(x, y);
        elmt.style.display = '';

        return elmtBelow;
    }

    _publishInteraction(event_type, letter) {
        if (!this.currKeyboardKey) return;   // Means no interaction is happening, do nothing

        const msg = {
            letterOfDraggableKey: letter,
            letterOfKeyboardKey: this.currKeyboardKey.getAttribute('key-face-letter')
        };

        publishEvent(event_type, msg);
    };

    _initOnDocMouseUp(letter) {
        // `mouseup` event needs to be on document, not draggableKey, because
        // sometimes when key is picked up outside its edge, its `mouseup`
        // doesn't trigger and it continues to move
        document.onmouseup = () => {
            document.onmousemove = null;

            if (this.currKeyboardKey) {
                // Letting go above a keyboard key!
                this._publishInteraction('draggableKeyLetGoAboveKeyboardKey', letter);

                // Set to `null`, marks end of interaction
                this.currKeyboardKey = null;
            };

            document.onmouseup = null;
        };
    };

    _setKeyVisibility(letter, visibility) {
        const keyDiv = this.letterToKeyDiv[letter];

        if (visibility === DraggableKeyVisibility.HIDDEN) {
            keyDiv.style.display = 'none';
        }
        else if (visibility === DraggableKeyVisibility.VISIBLE) {
            keyDiv.style.display = '';
        }
        else {
            throw new Error(`Invalid 'DraggableKeyVisibility' = ${state}`);
        };

        this.letterToKeyVis[letter] = visibility;
    };

    _returnKeyToGrid(letter) {
        const keyDiv = this.letterToKeyDiv[letter];
        // Remove any 'absolute' positioning
        keyDiv.style.position = '';

        const cellDiv = this.keyGridDiv.querySelector(`#cell${letter}`);
        cellDiv.append(keyDiv);

        this.letterToKeyLoc[letter] = DraggableKeyLocation.GRID;
    };

    _updateDraggableKeys(keyGuesses) {
        const guesses = Object.values(keyGuesses);

        for(const [letter, guess] of Object.entries(keyGuesses)) {
            const letterHasGuess = guess !== ''

            if (
                letterHasGuess && this.letterToKeyLoc[guess] !== DraggableKeyLocation.KEYBOARD
            ) {
                this._setKeyVisibility(guess, DraggableKeyVisibility.HIDDEN);
                this.letterToKeyLoc[guess] = DraggableKeyLocation.KEYBOARD;
                continue;
            };

            const letterIsAGuess = guesses.includes(letter);

            if (
                !letterIsAGuess && this.letterToKeyLoc[letter] === DraggableKeyLocation.KEYBOARD
            ) {
                this._setKeyVisibility(letter, DraggableKeyVisibility.VISIBLE);
                this._returnKeyToGrid(letter);
            };
        };
    };

    displayDraggableKeysGrid() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.keyGridDiv);

        for (const letter of Object.keys(this.letterToKeyDiv)) {
            this.letterToKeyVis[letter] = DraggableKeyVisibility.VISIBLE;
        };
    };
};

export { DraggableKeysView, DraggableKeyVisibility };
