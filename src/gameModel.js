import { publishEvent } from "./eventBus.js";
import {
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
} from "./utils/localStorageUtils/gameProgressUtils.js";
import {
    initStoredGameScoreCounts,
    getStoredGameScoreCounts,
    incStoredGameCount
} from "./utils/localStorageUtils/gameScoreCountsUtils.js"


const NO_GUESS_STR = ''

const GameStage = {
    MEMORIZE: 'Memorize',
    GUESS: 'Guess',
    RESULTS: 'Results'
}


/**
 * @class GameModel
 * 
 * 
 */
class GameModel {
    constructor() {
        // TODO: pass game date to constructor, call `gameDate` instead of `todaysDate`
        this._todaysDate = new Date().toDateString();
        this._todaysLetterList = this._genTodaysLetterList();

        // TODO: create class / func for validating words instead?
        this._dictionary = new Typo(
            "en_US", false, false, { dictionaryPath: "external/typo" }
        );

        // TODO: create class for 'GameProgress' ?
        this._goldenWords;
        this._keyGuesses;
        this._stage;
        this._initGameProgress();

        if (!getStoredGameScoreCounts()) {
            initStoredGameScoreCounts();
        };
    };

    _initGameProgress() {
        const gameProgress = getStoredGameProgress();

        if (!gameProgress || gameProgress.date !== this._todaysDate) {
            setStoredGameProgress(
                this._todaysDate,
                [],
                this._getEmptyKeyGuesses(),
                GameStage.MEMORIZE,
                false
            );
        };

        this._initGoldenWords();
        this._initKeyGuesses();
        this._initStage();
    };

    _initGoldenWords() {
        const goldenWords = getStoredGoldenWords();

        if (!goldenWords) {
            console.error(
                'Error: Failed to load golden words, using default of empty list'
            );
            this._goldenWords = [];
        }
        else {
            this._goldenWords = goldenWords;
        };
    };

    _initKeyGuesses() {
        const keyGuesses = getStoredKeyGuesses();

        if (!keyGuesses) {
            console.error(
                'Error: Failed to load key guesses, using default of no guesses'
            );
            this._keyGuesses = this._getEmptyKeyGuesses();
        }
        else {
            this._keyGuesses = keyGuesses;
        };
    };

    _initStage() {
        const stage = getStoredStage();

        if (!stage) {
            console.error(
                'Error: Failed to load game stage, using default of `Memorize`'
            );
            this._stage = GameStage.MEMORIZE
        }
        else {
            this._stage = stage
        };
    };

    _getEmptyKeyGuesses() {
        const keyGuesses = {};

        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
            keyGuesses[letter] = NO_GUESS_STR;
        });

        return keyGuesses;
    };

    /**
     * Generates a randomized list of uppercase letters based on today's date,
     * to be used as today's keyboard layout.
     * 
     * Uses the current date to generate a seed for the random number generator.
     * This ensures that all players get the same layout on any given day.
     */
    _genTodaysLetterList() {
        const rng = new Math.seedrandom(this._todaysDate);
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const todaysLetterList = letters.sort(() => { return rng() - 0.5; });

        return todaysLetterList;
    };

    getTodaysLetterList() {
        return this._todaysLetterList;
    };

    getKeyGuesses() {
        return this._keyGuesses;
    };

    updateKeyGuess(keyLetter, newGuess) {
        this._keyGuesses[keyLetter] = newGuess;
        setStoredKeyGuesses({...this._keyGuesses});
        publishEvent('keyGuessesUpdated', {...this._keyGuesses});
    };

    getStage() {
        return this._stage;
    };

    setStage(stage) {
        this._stage = stage;
        setStoredStage(this._stage);
    };

    getGameScore() {
        let correctGuessCount = 0;

        for (const [letter, guess] of Object.entries(this._keyGuesses)) {
            if (letter === guess) {
                correctGuessCount++;
            };
        };

        return correctGuessCount;
    };

    saveGameScore() {
        const isScoreSaved = getStoredIsScoreSaved();

        if (isScoreSaved === false) {
            incStoredGameCount(this.getGameScore());
            setStoredIsScoreSaved(true);
        };
    };

    getGoldenWords() {
        return this._goldenWords;
    };

    isValidGoldenWord(word) {
        if (word.length === 1) {
            return false;
        };

        return this._dictionary.check(word);
    };

    hasGoldenWord(word) {
        return this._goldenWords.includes(word);
    };

    addGoldenWord(word) {
        this._goldenWords.push(word);
        setStoredGoldenWords([...this._goldenWords]);
        publishEvent('wordListUpdated', [...this._goldenWords]);
    };

    deleteGoldenWord(wordToDelete) {
        if (!this._goldenWords.includes(wordToDelete)) {
            return;
        };

        const newList = [];

        this._goldenWords.forEach((word) => {
            if (word !== wordToDelete) {
                newList.push(word);
            };
        });

        this._goldenWords = [...newList];
        setStoredGoldenWords([...this._goldenWords]);
        publishEvent('wordListUpdated', [...this._goldenWords]);
    };
};

export { GameModel, GameStage, NO_GUESS_STR };
