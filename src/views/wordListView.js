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
    constructor(
        wordsSet,
        isListItemSelectable,
        isListItemDeleteable
    ) {
        // Configurations
        this.isListItemDeleteable = isListItemDeleteable;
        this.isListItemSelectable = isListItemSelectable;

        // Variables to hold HTML Elements for easy access
        this.wordListSection;
        this.wordListCountSpan;
        this.coverageText;
        this.progressBar;
        this.wordListDiv;
        this.wordToItemContainer = {};

        // Variable to track currently selected word list item
        this.currSelectedWord = null;

        this._createWordListSection();
        this._subscribeToEvents();
        this._updateWordList(wordsSet);
    };

    _createWordListSection() {
        this.wordListSection = document.createElement('section');
        this.wordListSection.className = 'word-list__container';

        const headerContainer = this._createWordListHeaderContainer();
        const progressTextContainer = this._createProgressTextContainer();
        const progressBarContainer = this._createProgressBarContainer();
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

    _createWordListHeaderContainer() {
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

    _createProgressTextContainer() {
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

    _createProgressBarContainer() {
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

        const wordText = this._createListItemWordText(word);

        if (this.isListItemDeleteable) {
            const deleteIcon = this._createListItemDeleteIcon();
            itemContainer.append(wordText, deleteIcon);
        }
        else {
            itemContainer.append(wordText);
        };

        return itemContainer;
    };

    _createListItemWordText(word) {
        const wordText = document.createElement('p');
        wordText.textContent = word;
        wordText.className = 'word-list__item__word';

        return wordText;
    };

    _createListItemDeleteIcon() {
        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = 'x';
        deleteIcon.className = 'word-list__item__delete-icon';

        return deleteIcon;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'wordListUpdated', this._updateWordList.bind(this)
        );
    };

    _clearWordList() {
        const itemContainers = Object.values(this.wordToItemContainer);
        itemContainers.forEach((item) => item.remove());
        this.wordToItemContainer = {};
    };

    _updateWordList(wordsSet) {
        this._clearWordList();

        wordsSet.forEach((word) => {
            const newItemContainer = this._createWordListItemContainer(word);

            this.wordToItemContainer[word] = newItemContainer;
            this.wordListDiv.appendChild(newItemContainer);

            if (this.isListItemSelectable) {
                newItemContainer.classList.add('word-list__item__container-selectable');
                this._setListItemClickedEvent(word);
            };

            if (this.isListItemDeleteable) {
                this._setListItemDeleteClickedEvent(word);
            };
        });

        this.wordListCountSpan.textContent = wordsSet.size;
        this._updateProgress(wordsSet);

        publishEvent('wordListViewUpdated');
    };

    _setListItemClickedEvent(word) {
        const itemContainer = this.wordToItemContainer[word];
        const deleteIcon = itemContainer.querySelector('.word-list__item__delete-icon');

        itemContainer.addEventListener('click', (e) => {
            if (e.target === deleteIcon) { return; };

            if (this.currSelectedWord === word) {
                this._deselectListItem(word);
            }
            else if (!this.currSelectedWord) {
                this._selectListItem(word);
            }
            else {
                this._deselectListItem(this.currSelectedWord);
                this._selectListItem(word);
            };
        });
    };

    _setListItemDeleteClickedEvent(word) {
        const itemContainer = this.wordToItemContainer[word];
        const deleteIcon = itemContainer.querySelector('.word-list__item__delete-icon');

        deleteIcon.addEventListener('click', () => {
            if (this.isListItemSelectable && this.currSelectedWord === word) {
                this._deselectListItem(word);
                publishEvent('wordListViewWordDeselected', word);
            }

            publishEvent('wordListViewWordDeleted', word);
        });
    };

    _selectListItem(word) {
        const itemContainer = this.wordToItemContainer[word];
        itemContainer.classList.add('word-list__item__container-selected');
        this.currSelectedWord = word;

        publishEvent('wordListViewWordSelected', word);
    };

    _deselectListItem(word) {
        const itemContainer = this.wordToItemContainer[word];
        itemContainer.classList.remove('word-list__item__container-selected');
        this.currSelectedWord = null;

        publishEvent('wordListViewWordDeselected', word);
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

    displayWordListSection() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this.wordListSection);
    };

    removeWordListSection() {
        this.wordListSection.remove();
    };
};

export default WordListView;
