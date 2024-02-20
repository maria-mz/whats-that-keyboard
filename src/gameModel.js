import { publishEvent } from "./eventBus.js";

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
            this.keyGuesses[letter] = '';
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
        this.keyGuesses[keyLetter] = newGuess;
        // TODO: Save to local storage

        publishEvent('keyGuessesUpdated', this.keyGuesses);
    };

};

export default GameModel;
