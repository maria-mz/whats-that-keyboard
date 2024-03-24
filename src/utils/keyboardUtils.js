/**
 * Functions for working with keyboard mapping logic
 */


/**
 * Generate a key(board) layout for a given arrangement of letters.
 *
 * @param {string[]} letters - The letters to be arranged in the layout,
 *      processed sequentially
 * @returns {Object} - A mapping of each letter to its position {row, idx}
 *      on the keyboard
 * @example
 * const letters = [
 *      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', P', 'A', 'S', 'D',
 *      'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
 * ];
 * 
 * const layout = getKeyLayout(letters);
 * console.log(layout);
 * // Logs: {
 * //   'Q': {row: 0, idx: 0},
 * //   'W': {row: 0, idx: 1},
 * //   'E': {row: 0, idx: 2},
 * //   ...
 * //   'B': {row: 2, idx: 4},
 * //   'N': {row: 2, idx: 5},
 * //   'M': {row: 2, idx: 6}
 * // }
 */
function getKeyLayout(letters) {
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
 * Creates a mapping between letters of two key layouts based on their
 * shared position.
 *
 * @param {Object} keyLayoutSrc - The key layout to map from 
 * @param {Object} keyLayoutDst - The key layout to map to
 * @returns {Object} - The letter to letter mapping
 * @example
 * const keyLayoutSrc = {
 *     'Q': {row: 0, idx: 0},
 *     'W': {row: 0, idx: 1},
 *     'E': {row: 0, idx: 2},
 *     ...
 * };
 * const keyLayoutDst = {
 *     'P': {row: 0, idx: 0},
 *     'O': {row: 0, idx: 1},
 *     'I': {row: 0, idx: 2},
 *     ...
 * };
 * 
 * const letterMap = getLetterMap(keyLayoutSrc, keyLayoutDst);
 * console.log(letterMap);
 * // Logs: {
 * //   'Q': 'P',
 * //   'W': 'O',
 * //   'E': 'I',
 * //   ...
 * // }
 */
function getLetterMap(keyLayoutSrc, keyLayoutDst) {
    const map = {};

    for (
        const [
            letterFrom, { row: rowFrom, idx: idxFrom }
        ] of Object.entries(keyLayoutSrc)
    ) {
        const match = Object.entries(keyLayoutDst)
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
 * Creates a function that maps letters from the standard QWERTY keyboard
 * layout to letters in the given key layout.
 *
 * @param {Object} keyLayout - The key layout to map QWERTY layout to
 * @returns {Function} - A function that takes a letter from the QWERTY layout
 *      as input, and returns the corresponding letter in the given key layout
 * @example
 * const keyLayout = {
 *     'P': {row: 0, idx: 0},
 *     'O': {row: 0, idx: 1},
 *     'I': {row: 0, idx: 2},
 *     ...
 * };
 * 
 * const mapFunc = getQWERTYLetterMapFunc(keyLayout);
 * 
 * const mappedLetter = mapFunc('Q');
 * console.log(mappedLetter);
 * // Logs: 'P'
 */
function getQWERTYLetterMapFunc(keyLayout) {
    const qwertyLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    const qwertyLayout = getKeyLayout(qwertyLetters);

    const map = getLetterMap(qwertyLayout, keyLayout);

    return function (letter) {
        return map[letter.toUpperCase()];
    };
};


export { getKeyLayout, getLetterMap, getQWERTYLetterMapFunc };
