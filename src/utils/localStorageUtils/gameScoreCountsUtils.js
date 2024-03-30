/**
 * Functions for working with locally stored `gameScoreCounts`
 */

import { MIN_SCORE, MAX_SCORE } from "../../gameModel.js";


/**
 * Initializes the locally stored Game Score Counts with all counts set to zero.
 */
function initStoredGameScoreCounts() {
    const numScores = MAX_SCORE - MIN_SCORE + 1;
    const scoreCounts = new Array(numScores).fill(0);
    _setGameScoreCounts(scoreCounts);
};


/**
 * Sets the locally stored Game Score Counts.
 * 
 * @param {int[]} scoreCounts - The array of counts to set.
 */
function _setGameScoreCounts(scoreCounts) {
    localStorage.setItem('gameScoreCounts', JSON.stringify(scoreCounts));
};


/**
 * Retrieves all the locally stored Game Score Counts.
 * 
 * @returns {int[] | null} The Game Score Counts array, or `null` if not found.
 */
function getStoredGameScoreCounts() {
    const scoreCounts = localStorage.getItem('gameScoreCounts');
    return scoreCounts ? JSON.parse(scoreCounts) : null;
};


/**
 * Retrieves the stored count for a specific score.
 * 
 * @param {number} score - The score to retrieve the count.
 * @returns {number | null} The count, or `null` if not found.
 * @throws {Error} If the provided score is invalid.
 */
function getStoredGameCount(score) {
    if (score < MIN_SCORE || score > MAX_SCORE) {
        throw new Error(
            `Score is invalid; it should be between ${MIN_SCORE} and ${MAX_SCORE}`
        );
    };
    const scoreCounts = getStoredGameScoreCounts();
    return scoreCounts[score] ? scoreCounts : null;
};


/**
 * Increments the count by one for a specific score.
 * Note, will increment only if Game Score Counts has been initialized.
 * 
 * @param {number} score - The score to increment the count.
 * @throws {Error} If the provided score is invalid.
 */
function incrementStoredGameCount(score) {
    if (score < MIN_SCORE || score > MAX_SCORE) {
        throw new Error(
            `Score is invalid; it should be between ${MIN_SCORE} and ${MAX_SCORE}`
        );
    };

    const scoreCounts = getStoredGameScoreCounts();

    if (scoreCounts) {
        scoreCounts[score] += 1;
        _setGameScoreCounts(scoreCounts);
    };
};


export {
    initStoredGameScoreCounts,
    getStoredGameScoreCounts,
    getStoredGameCount,
    incrementStoredGameCount
};
