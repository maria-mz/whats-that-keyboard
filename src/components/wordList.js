function createWordListSection() {
    const wordListSection = document.createElement('section');
    wordListSection.className = 'word-list__container';

    const headerContainer = createHeaderContainer()

    const list = document.createElement('div');
    list.id = 'wordList';
    list.className = 'word-list';

    wordListSection.appendChild(headerContainer);
    wordListSection.appendChild(list);

    return wordListSection;
};

function createHeaderContainer() {
    const headerContainer = document.createElement('div');
    headerContainer.className = 'word-list__header-container';

    const listTitle = document.createElement('p');
    listTitle.textContent = 'Your words';
    listTitle.className = 'word-list__title';

    const listCount = document.createElement('span');
    listCount.textContent = 0;   // Initially no words
    listCount.id = 'wordListCount';
    listCount.className = 'word-list__count';

    headerContainer.appendChild(listTitle);
    headerContainer.appendChild(listCount);

    return headerContainer;
}

function createWordListItem(word) {
    const listItem = document.createElement('div');
    listItem.textContent = word;
    listItem.className = 'word-list__item';

    const deleteIcon = document.createElement('span');
    deleteIcon.textContent = '×';
    deleteIcon.className = 'word-list__delete-icon';

    listItem.appendChild(deleteIcon);

    return listItem;
};


export { createWordListSection, createWordListItem };
