/**
* Other utility functions...
*/


/**
 * Check if a given string is a single alphabetical letter.
 */
function isLetter(str) {
    return /^[a-zA-Z]$/.test(str);
};

/**
 * Convert the case of `char2` to the case of `char1`.
 * Expects characters.
 */
function convertCharCase(char1, char2) {
    if (char1 === char1.toUpperCase()) {
        return char2.toUpperCase();
    };
    return char2.toLowerCase();
};

/**
 * Sort an array of strings in ascending order
 */
function sortArray(arr) {
    return arr.sort((a, b) => a.localeCompare(b));
}


export { sortArray, isLetter, convertCharCase };
