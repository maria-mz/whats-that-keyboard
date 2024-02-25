import { publishEvent } from "./eventBus.js";

// TODO: define this in one place
const NO_GUESS_STR = ''

const NUM_LETTER_KEYS = 26

/**
 * @class GameModel
 * 
 * 
 */
class GameModel {
    constructor() {
        // TODO: if any words saved in local storage, get those 
        this.userWordsSet = new Set();
        this.todaysLetterList = this._genTodaysLetterList()

        this._initKeyGuesses();
    };

    _initKeyGuesses() {
        this.keyGuesses = {};

        // TODO: Get values from local storage, if not, start by
        // having no guess for each letter
        this.todaysLetterList.forEach((letter) => {
            this.keyGuesses[letter] = NO_GUESS_STR;
        });
    };

    /**
     * Generates a randomized list of uppercase letters based on today's date,
     * to be used as today's keyboard layout.
     * 
     * Uses the current date to generate a seed for the random number generator.
     * This ensures that all players get the same layout on any given day.
     */
    _genTodaysLetterList() {
        const todaysSeed = new Date().toDateString();

        const rng = new Math.seedrandom(todaysSeed);
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const todaysLetterList = letters.sort(() => { return rng() - 0.5; });

        return todaysLetterList;
    };

    getTodaysLetterList() {
        return this.todaysLetterList;
    };

    getUserWordsSet() {
        return this.userWordsSet;
    };

    getKeyGuesses() {
        return this.keyGuesses;
    }

    addUserWord(word) {
        if (word != '' && !this.userWordsSet.has(word)) {
            this.userWordsSet.add(word);
            // TODO: Save to local storage

            publishEvent('wordListUpdated', this.userWordsSet);
            return true;
        };
        return false;
    };

    deleteUserWord(word) {
        if (this.userWordsSet.has(word)) {
            this.userWordsSet.delete(word)
            // TODO: Save to local storage

            publishEvent('wordListUpdated', this.userWordsSet);
            return true;
        };
        return false;
    };

    updateKeyGuess(keyLetter, newGuess) {
        // TODO: Check if key is a valid word

        this.keyGuesses[keyLetter] = newGuess;
        // TODO: Save to local storage

        publishEvent('keyGuessesUpdated', this.keyGuesses);
    };

    getNumCorrectGuesses() {
        let numCorrectGuesses = 0;

        for (const [letter, guess] of Object.entries(this.keyGuesses)) {
            if (letter === guess) {
                numCorrectGuesses++;
            };
        };

        return numCorrectGuesses;
    };

    isGameOver() {
        const guesses = Object.values(this.keyGuesses);
        return !(guesses.includes(NO_GUESS_STR));
    };
};

export default GameModel;
