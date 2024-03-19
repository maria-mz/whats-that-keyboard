/**
 * Utility functions for working with locally stored `gameProgress`
 * 
 * Assumes the value of `gameProgress` is an object that must
 * always have these four keys:
 *      - `date`
 *      - `goldenWords`
 *      - `keyGuesses`
 *      - `stage`
 */


const SET_ERR_MSG = 'There is no Game Progress stored yet.'


/**
 * 
 * Getters
 * 
 */

function getStoredGameProgress() {
    const gameProgress = localStorage.getItem('gameProgress');
    return gameProgress ? JSON.parse(gameProgress) : null;
};

function getStoredGoldenWords() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.goldenWords : null
};

function getStoredKeyGuesses() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.keyGuesses : null
};

function getStoredDate() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.date : null
};

function getStoredStage() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.stage : null
};


/**
 * 
 * Setters
 * 
 */

function setStoredGameProgress(date, goldenWords, keyGuesses, stage) {
    if (!date || !goldenWords || !keyGuesses || !stage) {
        throw new Error('Failed to set Game Progress: Some values are missing.');
    };

    localStorage.setItem(
        'gameProgress',
        JSON.stringify({
            'date': date,
            'goldenWords': goldenWords,
            'keyGuesses': keyGuesses,
            'stage': stage
        })
    );
};

function setStoredGoldenWords(goldenWords) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set Golden Words: ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        goldenWords,    // The new value
        gameProgress.keyGuesses,
        gameProgress.stage
    );
};

function setStoredKeyGuesses(keyGuesses) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set Key Guesses: ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        keyGuesses,    // The new value
        gameProgress.stage
    );
};

function setStoredStage(stage) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set Stage: ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        gameProgress.keyGuesses,
        stage    // The new value
    );
};


export {
    getStoredGameProgress,
    getStoredGoldenWords,
    getStoredKeyGuesses,
    getStoredDate,
    getStoredStage,
    setStoredGameProgress,
    setStoredGoldenWords,
    setStoredKeyGuesses,
    setStoredStage
};
