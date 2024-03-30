import Keyboard from "./components/keyboard.js";
import { GuessableKeyboard } from "./components/guessableKeyboard.js"
import DayCountDownText from "./components/dayCountDownText.js";


const KEY_BG_HEX_CORRECT_GUESS = '#ddfbe9';
const KEY_BORDER_HEX_CORRECT_GUESS = '#66d38e';
const KEY_BG_HEX_WRONG_GUESS = '#f9e4e5';
const KEY_BORDER_HEX_WRONG_GUESS = '#ef999a';

const resultsProperties = {
    'poorScore': {
        'colour': '#ef999a',
        'msg': 'There\'s room for improvement.'
    },
    'okScore': {
        'colour': '#f5b87f',
        'msg': 'Solid effort.'
    },
    'goodScore': {
        'colour': '#66d38e',
        'msg': 'Good job!'
    },
    'greatScore': {
        'colour': '#208e46',
        'msg': 'Well done!'
    }
};


/**
 * Display for the Results Phase of the game.
 */
class ResultsPhaseView {
    /**
     * Creates an instance of `TestPhaseView`.
     * 
     * @param {object} keysLayout - The layout of keys for the keyboard
     * @param {object} keyGuesses - The final letter to guess mapping
     * @param {number} gameScore - The score of the game, i.e. the number
     *      of keys guessed correctly.
     */
    constructor(keysLayout, keyGuesses, gameScore) {
        this._keyGuesses = keyGuesses;
        this._gameScore = gameScore;

        this._keyboardAnswer = new Keyboard(keysLayout, true);
        this._keyboardGuess = new GuessableKeyboard(keysLayout, keyGuesses, true);
        this._colourKeyboardsByGuesses();

        this._dayCountDownText = new DayCountDownText();

        // The main HTML element
        this._resultsContainer;

        this._initView();
    };

    _colourKeyboardsByGuesses() {
        for (const [letter, guess] of Object.entries(this._keyGuesses)) {
            if (letter === guess) {
                this._keyboardGuess.setKeyColour(
                    letter, KEY_BG_HEX_CORRECT_GUESS, KEY_BORDER_HEX_CORRECT_GUESS
                );
                this._keyboardAnswer.setKeyColour(
                    letter, KEY_BG_HEX_CORRECT_GUESS, KEY_BORDER_HEX_CORRECT_GUESS
                );
            }
            else {
                this._keyboardGuess.setKeyColour(
                    letter, KEY_BG_HEX_WRONG_GUESS, KEY_BORDER_HEX_WRONG_GUESS
                );
            };
        };
    };

    _initView() {
        this._resultsContainer = document.createElement('div');
        this._resultsContainer.className = 'results__container';

        const answersContainer = this._createAnswersContainer();
        const scoreContainer = this._createScoreContainer();
        const timeLeftText = this._createTimeLeftText();

        this._resultsContainer.append(
            answersContainer, scoreContainer, timeLeftText
        );
    };

    _createAnswersContainer() {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'results__answers__container';

        const playerAnswerContainer = this._createAnswerContainer(
            'Your Answer', this._keyboardGuess.HTMLElement
        );
        const correctAnswerContainer = this._createAnswerContainer(
            'Correct Answer', this._keyboardAnswer.HTMLElement
        );

        answersContainer.append(playerAnswerContainer, correctAnswerContainer);

        return answersContainer;
    };

    _createAnswerContainer(titleText, keyboardElmt) {
        const container = document.createElement('div');

        const title = document.createElement('p');
        title.textContent = titleText;
        title.className = 'results__answer__title';

        container.append(title, keyboardElmt);

        return container;
    };

    _createScoreContainer() {
        const container = document.createElement('div');
        container.className = 'results__score__container';

        const resultsProperty = this._getResultsProperty();

        const scoreTitle = this._createScoreTitle();
        const scoreText = this._createScoreText(resultsProperty.colour);
        const scoreSubtitle = this._createScoreSubtitle(resultsProperty.msg);

        container.append(scoreTitle, scoreText, scoreSubtitle);

        return container;
    };

    _getResultsProperty() {
        if (this._gameScore < 10) { 
            return resultsProperties.poorScore;
        };
        if (this._gameScore >= 10 && this._gameScore < 20) { 
            return resultsProperties.okScore;
        };
        if (this._gameScore >= 20 && this._gameScore < 23) { 
            return resultsProperties.goodScore;
        };
        if (this._gameScore >= 23) {
            return resultsProperties.greatScore;
        };
    };

    _createScoreTitle() {
        const scoreTitle = document.createElement('p');
        scoreTitle.className = 'results__score-title';
        scoreTitle.textContent = 'You got'

        return scoreTitle;
    };

    _createScoreText(colour) {
        const scoreTotal = document.createElement('p');
        scoreTotal.className = 'results__score';
        scoreTotal.textContent = ' / 26';

        const score = document.createElement('span');
        score.textContent = this._gameScore;
        score.style.color = colour;

        scoreTotal.insertBefore(score, scoreTotal.firstChild);

        return scoreTotal;
    };

    _createScoreSubtitle(msg) {
        const scoreSubtitle = document.createElement('p');
        scoreSubtitle.className = 'results__score-subtitle';
        scoreSubtitle.innerHTML = `<strong>${msg}</strong><br>Thanks for playing today :-)`;

        return scoreSubtitle;
    };

    _createTimeLeftText() {
        const timeLeftText = document.createElement('p');
        timeLeftText.className = 'results__time-left-text';
        timeLeftText.innerHTML = 'Next game in: '
        timeLeftText.append(this._dayCountDownText.HTMLElement);
        
        return timeLeftText;
    };

    displayView() {
        this._dayCountDownText.startCountDown();
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this._resultsContainer);
    };

    removeView() {
        this._dayCountDownText.stopCountDown();
        this._resultsContainer.remove();
    };
};

export default ResultsPhaseView;
