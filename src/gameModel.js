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
        // TODO: placeholder for now, will get letters from database
        this.todaysLetterList = [
            'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W','Q', 'L', 'K', 'J',
            'H', 'G', 'F', 'D', 'S', 'A', 'M', 'N', 'B', 'V', 'C', 'X', 'Z'
        ];

        // TODO: if any words saved in local storage, get those 
        this.userWordsSet = new Set();

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

    calcGameAccuracyScorePerc() {
        let correctGuessCount = 0;

        for (const [letter, guess] of Object.entries(this.keyGuesses)) {
            if (letter === guess) {
                correctGuessCount++;
            };
        };

        const accuracyScore = (correctGuessCount / NUM_LETTER_KEYS) * 100;

        return accuracyScore;
    };

};

export default GameModel;
