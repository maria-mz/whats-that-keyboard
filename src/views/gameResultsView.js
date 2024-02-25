/**
 * @class GameResultsView
 * 
 * 
 */
class GameResultsView {
    constructor(playerKeyboardElmt, correctKeyboardElmt, numCorrectGuesses) {
        this._initView(playerKeyboardElmt, correctKeyboardElmt, numCorrectGuesses);
    };

    _initView(playerKeyboardElmt, correctKeyboardElmt, numCorrectGuesses) {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results__container';

        const answersContainer = this._createAnswersContainer(
            playerKeyboardElmt, correctKeyboardElmt
        );
        const scoreContainer = this._createScoreContainer(numCorrectGuesses);

        resultsContainer.append(answersContainer, scoreContainer);

        this.resultsContainer = resultsContainer;
    };

    _createAnswersContainer(playerKeyboardElmt, correctKeyboardElmt) {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'results__answers__container';

        const playerAnswerContainer = this._createAnswerContainer(
            'Your Answer', playerKeyboardElmt
        );
        const correctAnswerContainer = this._createAnswerContainer(
            'Correct Answer', correctKeyboardElmt
        );

        answersContainer.append(
            playerAnswerContainer, correctAnswerContainer
        );

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

    _createScoreContainer(numCorrectGuesses) {
        const container = document.createElement('div');
        container.className = 'results__score__container';

        const scoreTitle = this._createScoreTitle();
        const score = this._createScore(numCorrectGuesses);
        const scoreSubtitle = this._createScoreSubtitle();

        container.append(scoreTitle, score, scoreSubtitle);

        return container;
    };

    _createScoreTitle() {
        const scoreTitle = document.createElement('p');
        scoreTitle.className = 'results__score-title';
        scoreTitle.textContent = 'You got'

        return scoreTitle;
    };

    _createScore(numCorrectGuesses) {
        const scoreTotal = document.createElement('p');
        scoreTotal.className = 'results__score';
        scoreTotal.textContent = ' / 26';

        const score = document.createElement('span');
        score.textContent = numCorrectGuesses;
        score.style.color = '#008bf8';

        scoreTotal.insertBefore(score, scoreTotal.firstChild);

        return scoreTotal;
    };

    _createScoreSubtitle() {
        const scoreSubtitle = document.createElement('p');
        scoreSubtitle.className = 'results__score-subtitle';
        // TODO: Show different messages depending on score?
        scoreSubtitle.textContent = 'Well done! Thanks for playing :-)';

        return scoreSubtitle;
    };

    displayView() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.resultsContainer);
    };

    removeView() {
        this.resultsContainer.remove();
    };
};

export default GameResultsView;
