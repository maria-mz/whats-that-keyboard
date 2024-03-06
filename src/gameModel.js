import { publishEvent } from "./eventBus.js";


// TODO: define this in one place
const NO_GUESS_STR = ''


/**
 * @class GameModel
 * 
 * 
 */
class GameModel {
    constructor() {
        // TODO: if any words saved in local storage, get those 
        this.dictionary = new Typo("en_US", false, false, { dictionaryPath: "ext/typo_js_dictionary" }),
        this.userWordsList = [];
        this.todaysLetterList = this._genTodaysLetterList();
        // this.todaysLetterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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

    getUserWords() {
        return this.userWordsList;
    };

    getKeyGuesses() {
        return this.keyGuesses;
    }

    addUserWord(word) {
        this.userWordsList.push(word);
        // TODO: Save to local storage

        publishEvent('wordListUpdated', this.userWordsList);
    };

    isWordValid(word) {
        // Don't allow single letters, not handled by typo.js
        if (word.length === 1) {
            return false;
        };

        return this.dictionary.check(word);
    };

    isWordInWordList(word) {
        return this.userWordsList.includes(word);
    };

    deleteUserWord(wordToDelete) {
        if (this.userWordsList.includes(wordToDelete)) {
            // Just make a new array to not include deleted word...
            const newList = [];

            this.userWordsList.forEach((word) => {
                if (word !== wordToDelete) {
                    newList.push(word);
                };
            });

            this.userWordsList = [...newList];
            // TODO: Save to local storage

            publishEvent('wordListUpdated', this.userWordsList);
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
