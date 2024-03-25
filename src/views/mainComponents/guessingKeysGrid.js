import {  getX, getY, moveElmtTo, boundElmtInsideWindow } from "../../utils/DOMUtils.js";
import { publishEvent, subscribeEvent } from '../../eventBus.js';
import { NO_GUESS_STR } from "../../constants.js";


/**
 * Represents the current general location of a guessing key.
 * 
 * @const {object} GuessingKeyLocation
 */
const GuessingKeyLocation = {
    GRID: "grid",
    DOCUMENT: "document"
};


/**
 * Represents the HTML component for the grid of guessing keys.
 * 
 * Guessing keys are draggable keys, used to make guesses for keys on the
 * keyboard. Those keys are referred to as 'guessable' keys.
 * 
 * Initially, all guessing keys belong to a grid, but they can be picked up
 * by the user, and moved freely anywhere in the document. Once used as a
 * guess, the guessing key becomes hidden.
 */
class GuessingKeysGrid {
    /**
     * Creates a new `GuessingKeysGrid` component.
     * 
     * @param {object} keyGuesses - The initial set of guesses. A letter to guess
     *      mapping. If a guess has been made for a key, the corresponding guessing
     *      key will appear hidden. Otherwise, it will be made visible.
     * @param {boolean} showAnim - To show pop-up animation on grid display or not
     */
    constructor(keyGuesses, showAnim) {
        this.letterToKeyDiv = {};
        this.letterToKeyLoc = {};
        this.letterToIsUsedAsGuess = {};

        // The guessable key currently under the cursor that is holding a
        // guessing key.
        this.currGuessableKey = null;

        this._initGuessingKeys();
        this._subscribeToEvents();

        this._updateGuessingKeys(keyGuesses);

        if (showAnim) {
            this._addKeysAnimation();
        };
    };

    /**
     * Initializes the guessing key HTML elements of the grid.
     * 
     * By default, no keys have been used as a guess yet.
     */
    _initGuessingKeys() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

        letters.forEach((letter) => {
            const guessingKeyDiv = this._createGuessingKeyDiv(letter);

            this.letterToKeyDiv[letter] = guessingKeyDiv;

            this.letterToIsUsedAsGuess[letter] = false;
            this._enableDragging(letter);
        });

        this._initKeyGridContainer();
    };

    /**
     * Sets up pop-up animation for the guessing keys of the grid.
     */
    _addKeysAnimation() {
        // Setup allows the animation to start at the top left
        // key then propagate diagonally across the grid
        const numLettersInRow = 7;  // From CSS grid box
        let rowCount = 0
        let animationDelay;

        const keyDivs = Object.values(this.letterToKeyDiv);

        keyDivs.forEach((keyDiv, i) => {
            const rowIdx = i % numLettersInRow;
            animationDelay = (rowCount + rowIdx) * 0.05;
            rowCount = (rowIdx === 0) ? rowCount + 1 : rowCount;

            keyDiv.classList.add('key-animation');
            keyDiv.style.animationDelay = `${animationDelay}s`;

        });
    };

    _createGuessingKeyDiv(letter) {
        const guessingKeyDiv = document.createElement('div');
        guessingKeyDiv.classList.add('key', 'is-draggable');
        guessingKeyDiv.textContent = letter;

        return guessingKeyDiv;
    };

    /**
     * Initializes the main, grid container HTML element.
     */
    _initKeyGridContainer() {
        const keyGridContainer = document.createElement('div');
        keyGridContainer.className = 'key-grid__container';

        const keyGridTitle = this._createKeyGridTitle();
        const keyGridDiv = this._createKeyGridDiv();

        keyGridContainer.append(keyGridTitle);
        keyGridContainer.append(keyGridDiv);

        this.keyGridContainer = keyGridContainer;
        this.keyGridDiv = keyGridDiv;
    };

    _createKeyGridTitle() {
        const keyGridTitle = document.createElement('p');
        keyGridTitle.className = 'key-grid__title';
        keyGridTitle.textContent = 'Make your guess!';

        return keyGridTitle;
    };

    /**
     * Creates the grid HTML element, and appends all guessing keys to it.
     */
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

    /**
     * Enables dragging functionality for the specified guessing key.
     * Note, this only takes effect if the key is visible.
     */
    _enableDragging(letterOfGuessingKey) {
        const guessingKeyDiv = this.letterToKeyDiv[letterOfGuessingKey];

        guessingKeyDiv.onmousedown = (e) => {
            const x = getX(guessingKeyDiv);
            const y = getY(guessingKeyDiv);

            const guessingKeyLoc = this.letterToKeyLoc[letterOfGuessingKey];

            if (guessingKeyLoc === GuessingKeyLocation.GRID) {
                // Remove animation otherwise it will replay continuously
                // as the key updates its position when moved
                guessingKeyDiv.style.animation = 'none';
                guessingKeyDiv.style.opacity = '1';

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

                this.letterToKeyLoc[letterOfGuessingKey] = GuessingKeyLocation.DOCUMENT;
            };

            // Append to document, this ensures that the currently held key
            // appears above all the other moved keys
            document.body.append(guessingKeyDiv);

            // These shifts ensure that when the element moves, it stays where it
            // was picked up by the cursor. Otherwise it will jump to be centered
            // under the cursor
            const shiftX = e.clientX - x;
            const shiftY = e.clientY - y;

            this._initOnDocMouseMove(letterOfGuessingKey, shiftX, shiftY);
            this._initOnDocMouseUp(letterOfGuessingKey);
        };
    };

    /**
     * Sets up the document `mousemove` event.
     * This handles the movement of the specified guessing key.
     */
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

    _getElementBelow(elem, x, y) {
        elem.style.display = 'none';
        const elmtBelow = document.elementFromPoint(x, y);
        elem.style.display = '';

        return elmtBelow;
    };

    /**
     * Publishes an interaction between a guessing key and a guessable key
     * to the global Event Bus.
     * 
     * @param {string} eventType - The type of interaction event to publish
     * @param {string} letterOfGuessingKey - The guessing key letter
     */
    _publishInteraction(eventType, letterOfGuessingKey) {
        if (!this.currGuessableKey) return;

        const msg = {
            'letterOfGuessingKey': letterOfGuessingKey,
            'letterOfGuessableKey': this.currGuessableKey.getAttribute('key-face-letter')
        };

        publishEvent(eventType, msg);
    };

    /**
     * Sets up the document `mouseup` event.
     * This handles the release of the specified guessing key.
     */
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

    _useGuess(letterOfGuessingKey) {
        this.letterToKeyDiv[letterOfGuessingKey].style.display = 'none';
        this.letterToIsUsedAsGuess[letterOfGuessingKey] = true;
    };

    _restoreGuess(letterOfGuessingKey) {
        this.letterToKeyDiv[letterOfGuessingKey].style.display = '';
        this.letterToIsUsedAsGuess[letterOfGuessingKey] = false;
    };

    /**
     * Returns a guessing key to its original grid position.
     */
    _returnKeyToGrid(letterOfGuessingKey) {
        const guessingKeyDiv = this.letterToKeyDiv[letterOfGuessingKey];
        // Remove any 'absolute' positioning
        guessingKeyDiv.style.position = '';

        const cellDiv = this.keyGridDiv.querySelector(`#cell${letterOfGuessingKey}`);
        cellDiv.append(guessingKeyDiv);

        this.letterToKeyLoc[letterOfGuessingKey] = GuessingKeyLocation.GRID;
    };

    /**
     * Updates the display of guessing keys to reflect the key guesses.
     * 
     * @param {object} keyGuesses - The letter to guess mapping
     */
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

    /**
     * Retrieves the HTML element of the grid. Note, only guessing keys
     * that belong to the grid at the time of the call will show up in
     * the grid.
     * 
     * @returns {HTMLElement} - The grid HTML element
     */
    get HTMLElement() {
        return this.keyGridContainer;
    };

    /**
     * Removes all guessing keys from the display, regardless of their
     * current location.
     */
    removeGuessingKeys() {
        for (const [letter, keyDiv] of Object.entries(this.letterToKeyDiv)) {
            // For simplicity make sure to return the key back to the grid
            // Otherwise if key was in document need to track position...
            // Easier this way
            this._returnKeyToGrid(letter);
            keyDiv.remove();
        };
    };
};

export default GuessingKeysGrid;
