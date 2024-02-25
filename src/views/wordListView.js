import { subscribeEvent, publishEvent } from '../eventBus.js';


const HEX_COVERAGE_LOW = '#d1002d';
const HEX_COVERAGE_OK = '#fdad0c';
const HEX_COVERAGE_GOOD = '#8bdc83';
const HEX_COVERAGE_GREAT = '#178317'


/**
 * @class WordListView
 * 
 * 
 */
class WordListView {
    // TODO: update init to take in the words, and call update
    constructor() {
        this._initWordListSection();
        this._subscribeToEvents()
    };

    _initWordListSection() {
        this.wordListSection = document.createElement('section');
        this.wordListSection.className = 'word-list__container';

        const headerContainer = this._initWordListHeaderContainer();
        const progressTextContainer = this._initProgressTextContainer();
        const progressBarContainer = this._initProgressBarContainer();
        this.wordListDiv = this._createWordListDiv();

        this.wordListSection.append(
            headerContainer,
            progressTextContainer,
            progressBarContainer,
            this.wordListDiv
        );
    };

    _createWordListDiv() {
        const wordListDiv = document.createElement('div');
        wordListDiv.id = 'wordList';
        wordListDiv.className = 'word-list';

        return wordListDiv;
    };

    _initWordListHeaderContainer() {
        const headerContainer = document.createElement('div');
        headerContainer.className = 'word-list__header__container';

        const listTitle = this._createWordListTitle();
        this.wordListCountSpan = this._createWordListCountSpan();

        headerContainer.append(listTitle, this.wordListCountSpan);

        return headerContainer;
    };

    _createWordListTitle() {
        const listTitle = document.createElement('p');
        listTitle.textContent = 'Words';
        listTitle.className = 'word-list__header__title';

        return listTitle;
    };

    _createWordListCountSpan() {
        const wordListCountSpan = document.createElement('span');
        wordListCountSpan.id = 'wordListCount';
        wordListCountSpan.className = 'word-list__header__count';

        return wordListCountSpan;
    };

    _initProgressTextContainer() {
        const progressTextContainer = document.createElement('div');
        progressTextContainer.className = 'word-list__progress-text__container';

        const progressTitle = this._createProgressTextTitle();
        this.coverageText = this._createProgressTextConverage();

        progressTextContainer.append(progressTitle, this.coverageText);

        return progressTextContainer;
    };

    _createProgressTextTitle() {
        const title = document.createElement('p');
        title.className = 'word-list__progress-text__title';
        title.textContent = 'Keys Coverage';

        return title;
    };

    _createProgressTextConverage() {
        const coverageText = document.createElement('p');
        coverageText.className = 'word-list__progress-text__coverage';
        coverageText.textContent = '0 / 26';

        return coverageText;
    };

    _initProgressBarContainer() {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'word-list__progress-bar__container';

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'word-list__progress-bar';

        progressBarContainer.append(this.progressBar);

        return progressBarContainer;
    };

    _createWordListItemContainer(word) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'word-list__item__container';

        const itemWord = document.createElement('p');
        itemWord.textContent = word;
        itemWord.className = 'word-list__item__word';
    
        const itemDeleteIcon = document.createElement('span');
        itemDeleteIcon.textContent = 'x';
        itemDeleteIcon.className = 'word-list__item__delete-icon';
    
        itemContainer.append(itemWord, itemDeleteIcon);
    
        return itemContainer;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'wordListUpdated', this._updateWordList.bind(this)
        );
    };

    _clearWordList() {
        const itemContainers = document.querySelectorAll('.word-list__item__container');
        itemContainers.forEach((item) => item.remove());
    };

    _updateWordList(wordsSet) {
        this._clearWordList();

        wordsSet.forEach((word) => {
            const newWordItemDiv = this._createWordListItemContainer(word);
            const deleteIcon = newWordItemDiv.querySelector('.word-list__item__delete-icon');

            deleteIcon.addEventListener('click', () => {
                publishEvent('wordListViewWordDeleted', word);
            });

            this.wordListDiv.appendChild(newWordItemDiv);
        });

        // Update words count
        this.wordListCountSpan.textContent = wordsSet.size;

        // Update progress bar and coverage text
        this._updateProgress(wordsSet);

        publishEvent('wordListViewUpdated');
    };

    _updateProgress(wordsSet) {
        const coverage = this._getLetterCoverage(wordsSet);
        const percentCoverage = (coverage / 26) * 100;

        this._updateProgressCoverageText(coverage);
        this._updateProgressBar(percentCoverage, this._getProgressBarColour(coverage))
    };

    _getLetterCoverage(wordsSet) {
        const concatenatedWords = Array.from(wordsSet).join("").toLowerCase();
        const includedLetters = new Set()

        for (let i = 0; i < concatenatedWords.length; i++) {
            includedLetters.add(concatenatedWords[i]);
        };

        return includedLetters.size;
    };

    _updateProgressCoverageText(newCoverage) {
        this.coverageText.textContent = `${newCoverage} / 26`
    };

    _updateProgressBar(percentCoverage, barColour) {
        this.progressBar.style.width = `${percentCoverage}%`
        this.progressBar.style.background = barColour;
    };

    _getProgressBarColour(coverage) {
        if (coverage < 10) { return HEX_COVERAGE_LOW; };
        if (coverage >= 10 && coverage < 20) { return HEX_COVERAGE_OK };
        if (coverage >= 20 && coverage < 23) { return HEX_COVERAGE_GOOD };
        if (coverage >= 23) { return HEX_COVERAGE_GREAT };
    };

    displayWordListSection(words = new Set()) {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.wordListSection);

        this._updateWordList(words);
    };

    removeWordListSection() {
        this.wordListSection.remove();
    };
};

export default WordListView;
