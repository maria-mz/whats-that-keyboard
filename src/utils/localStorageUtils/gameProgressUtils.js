/**
 * Utility functions for working with locally stored `gameProgress`
 * 
 * Assumes the value of `gameProgress` is an object that must
 * always have these four keys:
 *      - `date`
 *      - `goldenWords`
 *      - `keyGuesses`
 *      - `stage`
 *      - `resultsSnapshot`
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
    return gameProgress ? gameProgress.goldenWords : null;
};

function getStoredKeyGuesses() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.keyGuesses : null;
};

function getStoredStage() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.stage : null;
};

function getResultsSnapshot() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.resultsSnapshot : null;
};


/**
 * 
 * Setters
 * 
 */

function setStoredGameProgress(
    date, goldenWords, keyGuesses, stage, resultsSnapshot
) {
    if (
        date === undefined ||
        goldenWords === undefined ||
        keyGuesses === undefined ||
        stage === undefined ||
        resultsSnapshot === undefined
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
            'resultsSnapshot': resultsSnapshot
        })
    );
};

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
        gameProgress.resultsSnapshot
    );
};

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
        gameProgress.resultsSnapshot
    );
};

function setStoredStage(stage) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'stage': ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        gameProgress.keyGuesses,
        stage,    // The new value,
        gameProgress.resultsSnapshot
    );
};

function setResultsSnapshot(resultsSnapshot) {
    const gameProgress = getStoredGameProgress();

    if (!gameProgress) {
        throw new Error(`Failed to set 'resultsSnapshot': ${SET_ERR_MSG}`);
    };

    setStoredGameProgress(
        gameProgress.date,
        gameProgress.goldenWords,
        gameProgress.keyGuesses,
        gameProgress.stage,
        resultsSnapshot    // The new value
    );
};


export {
    getStoredGameProgress,
    getStoredGoldenWords,
    getStoredKeyGuesses,
    getStoredStage,
    getResultsSnapshot,
    setStoredGameProgress,
    setStoredGoldenWords,
    setStoredKeyGuesses,
    setStoredStage,
    setResultsSnapshot
};
