/**
 * Generate a key(board) layout for a given set of letters.
 *
 * @param {string[]} letters - The letters to be arranged in the
 *      layout, processed sequentially.
 * @returns {Object} - A mapping of each letter to its position
 *      {row, idx} on the keyboard.
 */
const getKeyLayout = (letters) => {
    const lettersCopy = [...letters];
    const keysPerRow = [10, 9, 7];
    const keyLayout = {};

    keysPerRow.forEach((keysPerRow, row) => {
        for (let idx = 0; idx < keysPerRow; idx++) {
            const letter = lettersCopy.shift();
            keyLayout[letter.toUpperCase()] = {row: row, idx: idx};
        };
    });

    return keyLayout;
};

/**
* Takes in two key layouts, and creates a mapping between the
* letters based on their shared position.
*/
const getLetterMap = (keyLayoutMapFrom, keyLayoutMapTo) => {
    const map = {};

    for (
        const [
            letterFrom, { row: rowFrom, idx: idxFrom }
        ] of Object.entries(keyLayoutMapFrom)
    ) {
        const match = Object.entries(keyLayoutMapTo)
            .find(([_, { row: rowTo, idx: idxTo }]) =>
                rowFrom === rowTo && idxFrom === idxTo
            );

        if (match) {
            const [letterTo] = match;
            map[letterFrom.toUpperCase()] = letterTo.toUpperCase();
        };
    };

    return map;
};

/**
* Get a function that maps letters in standard QWERTY keyboard
* layout to letters in `keyLayoutMapTo`.
*/
const getMappedLetter = (keyLayoutMapTo) => {
    const qwertyLetters = [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z',
        'X', 'C', 'V', 'B', 'N', 'M'
    ];
    const qwertyLayout = getKeyLayout(qwertyLetters);

    const map = getLetterMap(qwertyLayout, keyLayoutMapTo);

    return function (letter) {
        return map[letter.toUpperCase()];
    };
};

/**
* Check if a given string is a single alphabetical letter.
*/
const isLetter = (str) => {
    return /^[a-zA-Z]$/.test(str);
};

/**
* Convert the case of `char2` to the case of `char1`.
* Expects characters.
*/
const convertCharCase = (char1, char2) => {
    if (char1 === char1.toUpperCase()) {
        return char2.toUpperCase();
    };
    return char2.toLowerCase();
};

/** 
 * Get left X-coordinate of HTML element `elmt` in viewport
 */
function getX(elmt) {
    return elmt.getBoundingClientRect().left;
};

/** 
* Get top Y-coordinate of HTML element `elmt` in viewport
*/
function getY(elmt) {
    return elmt.getBoundingClientRect().top;
};

/**
* Move an HTML element `elmt` to coordinates `x` and `y`
*/
function moveElmtTo(elmt, x, y) {
    elmt.style.left = x + 'px';
    elmt.style.top = y + 'px';
};

/**
* Adjust the current position of an HTML element `elmt` to
* keep it within the visible window
*/
function boundElmtInsideWindow(elmt) {
    const x = getX(elmt);
    const y = getY(elmt);

    let boundedX;
    let boundedY;

    if (x < 0) {
        // Prevents going outside Left edge
        boundedX = 0;
    } else {
        // Prevents going outside Right edge
        const maxX = window.innerWidth - elmt.offsetWidth;
        boundedX = Math.min(x, maxX);
    };

    if (y < 0) {
        // Prevents going outside Top edge
        boundedY = 0;
    } else {
        // Prevents going outside Bottom edge
        const maxY = window.innerHeight - elmt.offsetHeight;
        boundedY = Math.min(y, maxY);
    };

    moveElmtTo(elmt, boundedX, boundedY);
};

/**
* Sort an array of strings in ascending order
*/
function sortArray(arr) {
    return arr.sort((a, b) => a.localeCompare(b));
}

export {
    getX,
    getY,
    moveElmtTo,
    boundElmtInsideWindow,
    sortArray,
    getKeyLayout,
    getLetterMap,
    getMappedLetter,
    isLetter,
    convertCharCase
};
