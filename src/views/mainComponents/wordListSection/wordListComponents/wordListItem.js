/**
 * @class WordListItem
 * 
 * Represents an item in the Word List section. This item shows the word,
 * and can be selected and/or deleted.
 */
class WordListItem {
    constructor(word, isItemDeletable, isItemSelectable) {
        // Fixed configurations
        this._isItemDeletable = isItemDeletable;
        this._isItemSelectable = isItemSelectable;

        // Main HTML Element
        this._wordListItem = this._createWordListItem(word);
    };

    /**
     * Create HTML Element for the entire item
     */
    _createWordListItem(word) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'word-list__item__container';

        const wordText = this._createListItemWordText(word);

        if (this._isItemDeletable) {
            const deleteIcon = this._createListItemDeleteIcon();
            itemContainer.append(wordText, deleteIcon);
        }
        else {
            itemContainer.append(wordText);
        };

        if (this._isItemSelectable) {
            itemContainer.classList.add('word-list__item__container-selectable');
        }

        return itemContainer;
    };

    /**
     * Create HTML Element for the word text of the item
     */
    _createListItemWordText(word) {
        const wordText = document.createElement('p');
        wordText.textContent = word;
        wordText.className = 'word-list__item__word';

        return wordText;
    };

    /**
     * Create HTML Element for the delete icon of the item
     */
    _createListItemDeleteIcon() {
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'word-list__item__delete-icon');

        return deleteIcon;
    };

    /**
     * Make the item appear "selected", if allowed
     */
    selectListItem() {
        if (this._isItemSelectable) {
            this._wordListItem.classList.add('word-list__item__container-selected');
        }
        else {
            throw new Error(
                'Failed to select. This list item is not configured to be selected.'
            );
        };
    };

    /**
     * Make the item appear "deselected", if allowed
     */
    deselectListItem() {
        if (this._isItemSelectable) {
            this._wordListItem.classList.remove('word-list__item__container-selected');
        }
        else {
            throw new Error(
                'Failed to deselect. This list item is not configured to be selected.'
            );
        };
    };

    /**
     * Retrieve the item HTML Element
     */
    get HTMLElement() {
        return this._wordListItem;
    };

    /**
     * Retrieve the item's delete icon HTML Element
     */
    get deleteIconHTMLElement() {
        return this._wordListItem.querySelector('.word-list__item__delete-icon');
    };
};

export default WordListItem;
