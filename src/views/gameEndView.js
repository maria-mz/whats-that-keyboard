/**
 * @class GameEndResultsView
 * 
 * 
 */
class GameEndView {
    constructor(playerKeyboardElmt, correctKeyboardElmt, playerScore) {
        this._initView(playerKeyboardElmt, correctKeyboardElmt, playerScore);
    };

    _initView(playerKeyboardElmt, correctKeyboardElmt, playerScore) {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'game-end-results__container';

        const answersContainer = this._createAnswersContainer(
            playerKeyboardElmt, correctKeyboardElmt
        );
        const scoreContainer = this._createScoreContainer(playerScore);

        resultsContainer.append(answersContainer, scoreContainer);

        this.resultsContainer = resultsContainer;
    };

    _createAnswersContainer(playerKeyboardElmt, correctKeyboardElmt) {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'game-end-results__answers__container';

        const playerAnswerContainer = this._createAnswerContainer(
            'Your Answer', playerKeyboardElmt
        );
        const correctAnswerContainer = this._createAnswerContainer(
            'Today\'s Correct Answer', correctKeyboardElmt
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
        title.className = 'game-end-results__answer__title';

        container.append(title, keyboardElmt);

        return container;
    };

    _createScoreContainer(playerScore) {
        const container = document.createElement('div');
        container.className = 'game-end-results__score__container';

        const scoreTitle = this._createScoreTitle();
        const score = this._createScore(playerScore);
        const scoreSubtitle = this._createScoreSubtitle();

        container.append(scoreTitle, score, scoreSubtitle);

        return container;
    };

    _createScoreTitle() {
        const scoreTitle = document.createElement('p');
        scoreTitle.className = 'game-end-results__score-title';
        scoreTitle.textContent = 'You got'

        return scoreTitle;
    };

    _createScore(playerScore) {
        const score = document.createElement('div');
        score.className = 'game-end-results__score';
        score.textContent = `${playerScore}%`;

        return score;
    };

    _createScoreSubtitle() {
        const scoreSubtitle = document.createElement('div');
        scoreSubtitle.className = 'game-end-results__score-subtitle';
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

export default GameEndView;
