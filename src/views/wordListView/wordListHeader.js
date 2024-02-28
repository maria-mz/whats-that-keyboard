/**
 * @class WordListHeader
 * 
 * Represents the display for the Header of the Word List.
 * This includes the title and the count for the number of words in
 * the list.
 */
class WordListHeader {
    constructor() {
        // The main HTML Element
        this._wordListHeader = this._createListHeader();
    };

    /**
     * Create HTML Element for the entire Header
     */
    _createListHeader() {
        const container = document.createElement('div');
        container.className = 'word-list__header__container';

        const listTitle = this._createListTitle();
        const listCount = this._createListCountSpan();

        container.append(listTitle, listCount);

        return container;
    };

    /**
     * Create HTML Element for the title of the list
     */
    _createListTitle() {
        const listTitle = document.createElement('p');
        listTitle.className = 'word-list__header__title';
        listTitle.textContent = 'Words';

        return listTitle;
    };

    /**
     * Create HTML Element that shows the number of words in the list
     */
    _createListCountSpan() {
        const listCount = document.createElement('span');
        listCount.className = 'word-list__header__count';
        listCount.textContent = '0';

        return listCount;
    };

    /**
     * Set the count of items in the Header
     * 
     * @param {number} newCount - The new count of items to display
     */
    setListCount(newCount) {
        const listCount = this._wordListHeader.querySelector(
            '.word-list__header__count'
        );
        listCount.textContent = newCount;
    };

    /**
     * Retrieve the Header HTML Element
     */
    get HTMLElement() {
        return this._wordListHeader;
    };
};

export default WordListHeader;
