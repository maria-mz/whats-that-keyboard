import ProgressSection from './wordListComponents/progressSection.js';
import WordListHeader from './wordListComponents/wordListHeader.js';
import WordList from './wordListComponents/wordList.js';

import { subscribeEvent, publishEvent } from '../../../eventBus.js';


/**
 * Represents the HTML component for the word list section.
 */
class WordListSection {
    /**
     * Create a new `WordListSection` component.
     * 
     * @param {string[]} goldenWords - The initial list of Golden Words to display
     * @param {boolean} areItemsDeletable - Whether items in the list are deletable
     * @param {boolean} areItemsSelectable - Whether items in the list are selectable
     * @param {string} emptyStateHTMLText - The HTML to display when the list is empty
     */
    constructor(
        goldenWords, areItemsDeletable, areItemsSelectable, emptyStateHTMLText = ''
    ) {
        this._wordListSection;

        this._listHeader = new WordListHeader();
        this._progressSection = new ProgressSection();
        this._wordList = new WordList(
            goldenWords, areItemsDeletable, areItemsSelectable, emptyStateHTMLText
        );

        this._initWordListSection();

        this._subscribeToEvents();
        this._updateWordListSection(goldenWords);
    };

    _initWordListSection() {
        this._wordListSection = document.createElement('section');
        this._wordListSection.className = 'word-list__container';

        this._wordListSection.append(
            this._listHeader.HTMLElement, this._progressSection.HTMLElement,
            this._wordList.HTMLElement
        );
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
        };

        publishEvent('wordListViewUpdated');
    };

    /**
     * Retrieves the HTML element of the word list section.
     * 
     * @returns {HTMLElement} - The word list section HTML element
     */
    get HTMLElement() {
        return this._wordListSection;
    };
};

export default WordListSection;
