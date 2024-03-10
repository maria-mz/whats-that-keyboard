import Keyboard from "./keyboard.js";
import { GuessableKeyboard } from "./guessableKeyboard.js";


const KEY_BG_HEX_CORRECT_GUESS = '#ddfbe9';
const KEY_BORDER_HEX_CORRECT_GUESS = '#66d38e';
const KEY_BG_HEX_WRONG_GUESS = '#f9e4e5';
const KEY_BORDER_HEX_WRONG_GUESS = '#ef999a';


const resultsProperties = {
    'poorScore': {
        'scoreColour': '#ef999a',
        'msg': 'There\'s room for improvement.'
    },
    'okScore': {
        'scoreColour': '#f5b87f',
        'msg': 'Solid effort.'
    },
    'goodScore': {
        'scoreColour': '#66d38e',
        'msg': 'Good job!'
    },
    'greatScore': {
        'scoreColour': '#208e46',
        'msg': 'Well done!'
    }
};


/**
 * @class ResultsPhaseView
 * 
 * 
 */
class ResultsPhaseView {
    constructor(keysLayout, keyGuesses, numCorrectGuesses) {
        this._keyGuesses = keyGuesses;
        this._numCorrectGuesses = numCorrectGuesses;

        this._keyboardAnswer = new Keyboard(keysLayout, true);
        this._keyboardGuess = new GuessableKeyboard(keysLayout, keyGuesses, true);

        this._colourKeyboardsByGuesses();

        // The main HTML elemnt
        this._resultsContainer;

        this._initView();
    };

    _colourKeyboardsByGuesses() {
        for (const [letter, guess] of Object.entries(this._keyGuesses)) {
            if (letter === guess) {
                this._keyboardGuess.setKeyColour(
                    letter,
                    KEY_BG_HEX_CORRECT_GUESS,
                    KEY_BORDER_HEX_CORRECT_GUESS
                );
                this._keyboardAnswer.setKeyColour(
                    letter,
                    KEY_BG_HEX_CORRECT_GUESS,
                    KEY_BORDER_HEX_CORRECT_GUESS
                );
            }
            else {
                this._keyboardGuess.setKeyColour(
                    letter,
                    KEY_BG_HEX_WRONG_GUESS,
                    KEY_BORDER_HEX_WRONG_GUESS
                );
            };
        };
    };

    _initView() {
        this._resultsContainer = document.createElement('div');
        this._resultsContainer.className = 'results__container';

        const answersContainer = this._createAnswersContainer();
        const scoreContainer = this._createScoreContainer();

        this._resultsContainer.append(answersContainer, scoreContainer);
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
        const scoreText = this._createScoreText(resultsProperty.scoreColour);
        const scoreSubtitle = this._createScoreSubtitle(resultsProperty.msg);

        container.append(scoreTitle, scoreText, scoreSubtitle);

        return container;
    };

    _getResultsProperty() {
        if (this._numCorrectGuesses < 10) { 
            return resultsProperties.poorScore;
        };
        if (this._numCorrectGuesses >= 10 && this._numCorrectGuesses < 20) { 
            return resultsProperties.okScore;
        };
        if (this._numCorrectGuesses >= 20 && this._numCorrectGuesses < 23) { 
            return resultsProperties.goodScore;
        };
        if (this._numCorrectGuesses >= 23) {
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
        score.textContent = this._numCorrectGuesses;
        score.style.color = colour;

        scoreTotal.insertBefore(score, scoreTotal.firstChild);

        return scoreTotal;
    };

    _createScoreSubtitle(msg) {
        const scoreSubtitle = document.createElement('p');
        scoreSubtitle.className = 'results__score-subtitle';
        scoreSubtitle.innerHTML = `${msg}<br>Thanks for playing :-)`;

        return scoreSubtitle;
    };

    displayView() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this._resultsContainer);
    };

    removeView() {
        this._resultsContainer.remove();
    };
};

export default ResultsPhaseView;
