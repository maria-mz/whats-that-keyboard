/**
 * Functions for working with locally stored `gameProgress`
 * 
 * Assumes the value of `gameProgress` is an object that must
 * always have these five keys:
 *      - `date`
 *      - `goldenWords`
 *      - `keyGuesses`
 *      - `stage`
 *      - `isScoreSaved`
 */


const SET_ERR_MSG = 'There is no Game Progress stored yet.'


/**
 * Retrieves the locally stored Game Progress object.
 * 
 * @returns {object | null} The Game Progress, or `null` if not found.
 */
function getStoredGameProgress() {
    const gameProgress = localStorage.getItem('gameProgress');
    return gameProgress ? JSON.parse(gameProgress) : null;
};


/**
 * Retrieves the locally stored Golden Words.
 * 
 * @returns {Any | null} The Golden Words, or `null` if not found.
 */
function getStoredGoldenWords() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.goldenWords : null;
};


/**
 * Retrieves the locally stored Key Guesses.
 * 
 * @returns {Any | null} The Key Guesses, or `null` if not found.
 */
function getStoredKeyGuesses() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.keyGuesses : null;
};


/**
 * Retrieves the locally stored game Stage.
 * 
 * @returns {Any | null} The Stage, or `null` if not found.
 */
function getStoredStage() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.stage : null;
};


/**
 * Retrieves the locally stored score saved status.
 * 
 * @returns {Any | null} The score saved status, or `null` if not found.
 */
function getStoredIsScoreSaved() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.isScoreSaved : null;
};


/**
 * Sets the locally stored Game Progress object.
 * 
 * @throws {Error} If any argument is missing.
 */
function setStoredGameProgress(date, goldenWords, keyGuesses, stage, isScoreSaved) {
    if (
        date === undefined ||
        goldenWords === undefined ||
        keyGuesses === undefined ||
        stage === undefined ||
        isScoreSaved === undefined
    ) {
        throw new Error(
            'Failed to set Game Progress: Some arguments are missing.'
        );
    };

    localStorage.setItem(
        'gameProgress',
        JSON.stringify({
            'date': date,
            'goldenWords': goldenWords,
            'keyGuesses': keyGuesses,
            'stage': stage,
            'isScoreSaved': isScoreSaved
        })
    );
};


/**
 * Sets the locally stored Golden Words in the existing Game Progress object.
 * 
 * @param {Any} goldenWords - The new Golden Words to set.
 * @throws {Error} Thrown if Game Progress object is not found.
 */
function setStoredGoldenWords(goldenWords) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'goldenWords' ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        goldenWords,    // The new value
        gameProgress.keyGuesses,
        gameProgress.stage,
        gameProgress.isScoreSaved
    );
};


/**
 * Sets the locally stored Key Guesses in the existing Game Progress object.
 * 
 * @param {Any} keyGuesses - The new Key Guesses to set.
 * @throws {Error} Thrown if Game Progress object is not found.
 */
function setStoredKeyGuesses(keyGuesses) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'keyGuesses': ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        keyGuesses,    // The new value
        gameProgress.stage,
        gameProgress.isScoreSaved
    );
};


/**
 * Sets the locally stored Key Guesses in the existing Game Progress object.
 * 
 * @param {Any} stage - The new Key Guesses to set.
 * @throws {Error} Thrown if Game Progress object is not found.
 */
function setStoredStage(stage) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'stage': ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        gameProgress.keyGuesses,
        stage,    // The new value
        gameProgress.isScoreSaved
    );
};


/**
 * Sets the locally stored score saved status in the existing Game Progress object.
 * 
 * @param {Any} isScoreSaved - The new score saved status to set.
 * @throws {Error} Thrown if Game Progress object is not found.
 */
function setStoredIsScoreSaved(isScoreSaved) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'isScoreSaved': ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        gameProgress.keyGuesses,
        gameProgress.stage,
        isScoreSaved     // The new value
    );
};


export {
    getStoredGameProgress,
    getStoredGoldenWords,
    getStoredKeyGuesses,
    getStoredStage,
    getStoredIsScoreSaved,
    setStoredGameProgress,
    setStoredGoldenWords,
    setStoredKeyGuesses,
    setStoredStage,
    setStoredIsScoreSaved
};
