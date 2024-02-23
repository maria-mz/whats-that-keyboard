import { 
    getX,
    getY,
    moveElmtTo,
    boundElmtInsideWindow,
    sortArray
} from "../utils.js";

import { publishEvent, subscribeEvent } from '../eventBus.js';


/**
 * Represents the current general location of a guessing key
 * 
 * @const {object} GuessingKeyLocation
 */
const GuessingKeyLocation = {
    GRID: "grid",
    DOCUMENT: "document"
};

// TODO: define this in one place
const NO_GUESS_STR = ''


/**
 * @class GuessingKeysView
 * 
 */
class GuessingKeysView {
    constructor(letters, keyGuesses) {
        this.letterToKeyDiv = {};
        this.letterToKeyLoc = {};
        this.letterToIsUsedAsGuess = {};

        // The guessable key element under the cursor while a guessing
        // key is being moved
        this.currGuessableKey = null;

        this._initGuessingKeys(letters);
        this._subscribeToEvents();

        this._updateGuessingKeys(keyGuesses);
    };

    _initGuessingKeys(letters) {
        const sortedLetters = sortArray(letters);

        sortedLetters.forEach((letter) => {
            const guessingKeyDiv = this._createGuessingKeyDiv(letter);

            this.letterToKeyDiv[letter] = guessingKeyDiv;

            this.letterToIsUsedAsGuess[letter] = false;
            this._enableDragging(letter);
        });

        this.keyGridDiv = this._createKeyGridDiv()
    };

    _createGuessingKeyDiv(letter) {
        const guessingKeyDiv = document.createElement('div');
        guessingKeyDiv.classList.add('key', 'is-draggable');
        guessingKeyDiv.textContent = letter;

        return guessingKeyDiv;
    };

    _createKeyGridDiv() {
        const keyGridDiv = document.createElement('div');
        keyGridDiv.classList.add('key-grid');
        keyGridDiv.id = 'keyGrid';

        for (const [letter, guessingKeyDiv] of Object.entries(this.letterToKeyDiv)) {
            const cellDiv = document.createElement('div');
            cellDiv.id = `cell${letter}`;
            cellDiv.append(guessingKeyDiv);

            keyGridDiv.append(cellDiv);

            this.letterToKeyLoc[letter] = GuessingKeyLocation.GRID;
        }

        return keyGridDiv;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'keyGuessesUpdated', this._updateGuessingKeys.bind(this)
        );
    };

    _enableDragging(letter) {
        const guessingKeyDiv = this.letterToKeyDiv[letter];

        guessingKeyDiv.onmousedown = (e) => {
            const x = getX(guessingKeyDiv);
            const y = getY(guessingKeyDiv);

            const guessingKeyLoc = this.letterToKeyLoc[letter];

            if (guessingKeyLoc === GuessingKeyLocation.GRID) {
                // Update coordinates to the same position, prevents key from
                // jumping to top left corner
                moveElmtTo(guessingKeyDiv, x, y);

                // This allows key to be held + moved around
                guessingKeyDiv.style.position = 'absolute';

                // Remove guessing key from the grid.
                // Need to append to document body and not `gameArea`, since
                // it has relative positioning which makes updating key's
                // coordinates more complicated.
                // But document body makes sense, since you can move this key
                // anywhere on the page
                document.body.append(guessingKeyDiv);

                this.letterToKeyLoc[letter] = GuessingKeyLocation.DOCUMENT;
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

    _initOnDocMouseMove(letterOfGuessingKey, shiftX, shiftY) {
        const guessingKeyDiv = this.letterToKeyDiv[letterOfGuessingKey];

        document.onmousemove = (e) => {
            // Move the key
            const newX = e.pageX - shiftX;
            const newY = e.pageY - shiftY;

            moveElmtTo(guessingKeyDiv, newX, newY);
            boundElmtInsideWindow(guessingKeyDiv);

            // Check if hovering over a guessable key
            const elmtBelow = this._getElementBelow(guessingKeyDiv, e.clientX, e.clientY);

            if (!elmtBelow) return;

            const guessableKeyBelow = elmtBelow.closest('.guessable-key');

            // Handle possible interaction
            if (this.currGuessableKey != guessableKeyBelow) {
                if (this.currGuessableKey) {
                    this._publishInteraction(
                        'guessingKeyLeftGuessableKey', letterOfGuessingKey
                    );
                };

                this.currGuessableKey = guessableKeyBelow;

                if (this.currGuessableKey) {
                    this._publishInteraction(
                        'guessingKeyEnteredGuessableKey', letterOfGuessingKey
                    );
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

    _publishInteraction(eventType, letterOfGuessingKey) {
        if (!this.currGuessableKey) return;

        const msg = {
            letterOfGuessingKey: letterOfGuessingKey,
            letterOfGuessableKey: this.currGuessableKey.getAttribute('key-face-letter')
        };

        publishEvent(eventType, msg);
    };

    _initOnDocMouseUp(letterOfGuessingKey) {
        // `mouseup` event needs to be on document, not on the key, because
        // sometimes when key is picked up outside its edge, its `mouseup`
        // doesn't trigger and it continues to move
        document.onmouseup = () => {
            document.onmousemove = null;

            if (this.currGuessableKey) {
                this._publishInteraction(
                    'guessingKeyReleasedOnGuessableKey', letterOfGuessingKey
                );

                this.currGuessableKey = null;
            };

            document.onmouseup = null;
        };
    };

    _useGuess(letter) {
        const guessingKeyDiv = this.letterToKeyDiv[letter];
        guessingKeyDiv.style.display = 'none';

        // Note, while the guessing key is hidden, it cannot be picked up
        // and moved around

        this.letterToIsUsedAsGuess[letter] = true;
    };

    _restoreGuess(letter) {
        const guessingKeyDiv = this.letterToKeyDiv[letter];
        guessingKeyDiv.style.display = '';

        this.letterToIsUsedAsGuess[letter] = false;
    }

    _returnKeyToGrid(letter) {
        const guessingKeyDiv = this.letterToKeyDiv[letter];
        // Remove any 'absolute' positioning
        guessingKeyDiv.style.position = '';

        const cellDiv = this.keyGridDiv.querySelector(`#cell${letter}`);
        cellDiv.append(guessingKeyDiv);

        this.letterToKeyLoc[letter] = GuessingKeyLocation.GRID;
    };

    _updateGuessingKeys(keyGuesses) {
        const guesses = Object.values(keyGuesses);

        for(const [letter, guess] of Object.entries(keyGuesses)) {
            const letterHasGuess = (guess !== NO_GUESS_STR);

            if (letterHasGuess && !this.letterToIsUsedAsGuess[guess]) {
                this._useGuess(guess);
                continue;
            };

            const letterIsAGuess = guesses.includes(letter);

            if (!letterIsAGuess && this.letterToIsUsedAsGuess[letter]) {
                this._restoreGuess(letter);
                this._returnKeyToGrid(letter);
            };
        };
    };

    displayKeysGrid() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.keyGridDiv);
    };
};

export { GuessingKeysView };
