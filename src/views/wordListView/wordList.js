import WordListItem from "./wordListItem.js";
import { publishEvent } from "../../eventBus.js";


/**
 * @class WordList
 * 
 * Represents the list of words (list items) in the Word List section.
 * When certain events happen on items of the word list, appropriate events
 * are published to signal this.
 */
class WordList {
    // TODO: Handle animations when adding + deleting

    constructor(wordsSet, areItemsDeletable, areItemsSelectable) {
        // Fixed configurations
        this._areItemsDeletable = areItemsDeletable;
        this._areItemsSelectable = areItemsSelectable;

        // Main HTML Element
        this._wordList = this._createWordList();

        this._currSelectedWord = null;

        // Helps track individual `ListItem` by word. Note, words must be unique
        // in the word list, so this is ok
        this._wordToListItem = {};

        this.updateWordList(wordsSet);
    };

    /**
     * Create HTML Element for the list
     */
    _createWordList() {
        const wordList = document.createElement('div');
        wordList.id = 'wordList';
        wordList.className = 'word-list';

        return wordList;
    };

    /**
     * Remove all list items from the list
     */
    _clearWordList() {
        const listItems = Object.values(this._wordToListItem);
        listItems.forEach((item) => item.HTMLElement.remove());
        this._wordToListItem = {};
    };

    /**
     * Handle event that occurs when the list item for `word` is clicked
     */
    _setupListItemClickEvent(word) {
        const listItem = this._wordToListItem[word];
        const deleteIcon = listItem.deleteIconHTMLElement;

        listItem.HTMLElement.addEventListener('click', (e) => {
            if (e.target === deleteIcon) { return; };

            if (this._currSelectedWord === word) {
                this._deselectListItem(word);
            }
            else if (!this._currSelectedWord) {
                this._selectListItem(word);
            }
            else {
                this._deselectListItem(this._currSelectedWord);
                this._selectListItem(word);
            };
        });
    };

    /**
     * Handle event that occurs when the delete icon of the list item for
     * `word` is clicked
     */
    _setupListItemDeleteEvent(word) {
        const listItem = this._wordToListItem[word];
        const deleteIcon = listItem.deleteIconHTMLElement;

        deleteIcon.addEventListener('click', () => {
            if (this._areItemsSelectable && this._currSelectedWord === word) {
                this._deselectListItem(word);
                publishEvent('wordListViewWordDeselected', word);
            }

            publishEvent('wordListViewWordDeleted', word);
        });
    };

    /**
     * Visually select the list item for `word`
     */
    _selectListItem(word) {
        const itemList = this._wordToListItem[word];
        itemList.selectListItem();

        this._currSelectedWord = word;

        publishEvent('wordListViewWordSelected', word);
    };

    /**
     * Visually deselect the list item for `word`
     */
    _deselectListItem(word) {
        const itemList = this._wordToListItem[word];
        itemList.deselectListItem();

        this._currSelectedWord = null;

        publishEvent('wordListViewWordDeselected', word);
    };

    /**
     * Update the entire contents of the word list to showcase words
     * in `wordsSet`
     */
    updateWordList(wordsSet) {
        this._clearWordList();

        wordsSet.forEach((word) => {
            const newItem = new WordListItem(
                word, this._areItemsDeletable, this._areItemsSelectable
            );

            this._wordToListItem[word] = newItem;

            if (this._areItemsSelectable) {
                this._setupListItemClickEvent(word);
            };

            if (this._areItemsDeletable) {
                this._setupListItemDeleteEvent(word);
            };

            this._wordList.appendChild(newItem.HTMLElement);
        });
    };

    /**
     * Retrieve the Word List HTML Element
     */
    get HTMLElement() {
        return this._wordList;
    };
};

export default WordList;
