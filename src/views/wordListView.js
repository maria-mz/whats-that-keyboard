import { subscribeEvent, publishEvent } from '../eventBus.js';

/**
 * @class WordListView
 * 
 * 
 */
class WordListView {
    constructor() {
        this._initWordListSection();
        this._subscribeToEvents()
    };

    _initWordListSection() {
        this.wordListSection = document.createElement('section');
        this.wordListSection.className = 'word-list__container';

        const headerContainer = this._initWordListHeaderContainer();
        this.wordListDiv = this._createWordListDiv();

        this.wordListSection.append(headerContainer, this.wordListDiv);
    };

    _createWordListDiv() {
        const wordListDiv = document.createElement('div');
        wordListDiv.id = 'wordList';
        wordListDiv.className = 'word-list';

        return wordListDiv;
    };

    _initWordListHeaderContainer() {
        const headerContainer = document.createElement('div');
        headerContainer.className = 'word-list__header-container';

        const listTitle = this._createWordListTitle();
        this.wordListCountSpan = this._createWordListCountSpan();

        headerContainer.append(listTitle, this.wordListCountSpan);

        return headerContainer;
    };

    _createWordListTitle() {
        const listTitle = document.createElement('p');
        listTitle.textContent = 'Your words';
        listTitle.className = 'word-list__title';

        return listTitle;
    };

    _createWordListCountSpan() {
        const wordListCountSpan = document.createElement('span');
        wordListCountSpan.id = 'wordListCount';
        wordListCountSpan.className = 'word-list__count';

        return wordListCountSpan;
    };

    _createWordListItem(word) {
        const listItem = document.createElement('div');
        listItem.textContent = word;
        listItem.className = 'word-list__item';
    
        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = 'x';
        deleteIcon.className = 'word-list__delete-icon';
    
        listItem.appendChild(deleteIcon);
    
        return listItem;
    };

    _subscribeToEvents() {
        subscribeEvent(
            'wordListUpdated', this._updateWordList.bind(this)
        );
    };

    _clearWordList() {
        const wordListItems = document.querySelectorAll('.word-list__item');

        wordListItems.forEach((item) => item.remove());
    };

    _updateWordList(wordsSet) {
        this._clearWordList();

        wordsSet.forEach((word) => {
            const newWordItemDiv = this._createWordListItem(word);

            newWordItemDiv.addEventListener('click', () => {
                publishEvent('wordListViewWordDeleted', word);
            });

            this.wordListDiv.appendChild(newWordItemDiv);
        });

        this.wordListCountSpan.textContent = wordsSet.size;

        publishEvent('wordListViewUpdated');
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
