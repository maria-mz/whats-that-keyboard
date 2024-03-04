import ProgressSection from './progressSection.js';
import WordListHeader from './wordListHeader.js';
import WordList from './wordList.js';

import { subscribeEvent, publishEvent } from '../../eventBus.js';


/**
 * @class WordListSectionView
 * 
 * Represents entire display for Word List. This includes the header, progress,
 *  and word list components. This View is responsible for updating the display
 * when `wordListUpdated` events are published.
 */
class WordListSectionView {
    constructor(listWords, areItemsDeletable, areItemsSelectable) {
        // Main HTML Element
        this._wordListSection = document.createElement('section');
        this._wordListSection.className = 'word-list__container';

        // Components
        this._listHeader = new WordListHeader();
        this._progressSection = new ProgressSection();
        this._wordList = new WordList(listWords, areItemsDeletable, areItemsSelectable);

        // Build the element
        this._wordListSection.append(
            this._listHeader.HTMLElement,
            this._progressSection.HTMLElement,
            this._wordList.HTMLElement
        );

        this._subscribeToEvents();
        this._updateWordListSection(listWords);
    };

    _subscribeToEvents() {
        subscribeEvent(
            'wordListUpdated', this._updateWordListSection.bind(this)
        );
    };

    /**
     * Update display of Word List section to reflect new `listWords`
     */
    _updateWordListSection(listWords) {
        const numWords = listWords.length;

        this._listHeader.setListCount(numWords);
        this._progressSection.updateProgress(listWords);
        this._wordList.updateWordList(listWords);

        if (numWords === 0) {
            this._wordList.setEmptyState();
        }
        else {
            this._wordList.clearEmptyState();
        }

        publishEvent('wordListViewUpdated');
    };

    displayWordListSection() {
        const gameAreaSection = document.getElementById('gameArea');
        gameAreaSection.appendChild(this._wordListSection);
    };

    removeWordListSection() {
        this._wordListSection.remove();
    };
};

export default WordListSectionView;
