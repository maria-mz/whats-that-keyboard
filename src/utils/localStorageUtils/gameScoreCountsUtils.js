/**
 * Utility functions for working with locally stored `gameScoreCounts`
 */


function initStoredGameScoreCounts() {
    const numScores = 27;
    const scoreCounts = new Array(numScores).fill(0);
    _setGameScoreCounts(scoreCounts);
};

function _setGameScoreCounts(scoreCounts) {
    localStorage.setItem('gameScoreCounts', JSON.stringify(scoreCounts));
};

function getStoredGameScoreCounts() {
    const scoreCounts = localStorage.getItem('gameScoreCounts');
    return scoreCounts ? JSON.parse(scoreCounts) : null;
};

function getStoredGameCountByScore(score) {
    if (score < 0 || score > 26) {
        throw new Error('Score is invalid; it should be between 0 and 26');
    };
    const scoreCounts = getStoredGameScoreCounts();
    return scoreCounts[score] ? scoreCounts : null;
};

function incStoredGameCount(score) {
    if (score < 0 || score > 26) {
        throw new Error('Score is invalid; it should be between 0 and 26');
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
    getStoredGameCountByScore,
    incStoredGameCount
};
