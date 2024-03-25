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

function getStoredIsScoreSaved() {
    const gameProgress = getStoredGameProgress();
    return gameProgress ? gameProgress.isScoreSaved : null;
};

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
