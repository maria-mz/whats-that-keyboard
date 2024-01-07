const MAX_LINE_LEN = 50;
const MAX_LINES = 5;

let onEmptyState = false;

let textSpaceElmt = document.getElementById('textSpace')
let cursorElmt = textSpaceElmt.lastElementChild
let curLineElmt;


const setTSEmptyState = () => {
    onEmptyState = true;

    const placeholder = document.createElement('span');
    placeholder.classList.add('text-space-placeholder');
    placeholder.textContent = 'Type away...';
    textSpaceElmt.insertBefore(placeholder, cursorElmt);

    curLineElmt = placeholder;
}

const clearTSEmptyState = () => {
    onEmptyState = false;

    curLineElmt.classList.remove('text-space-placeholder');
    curLineElmt.textContent = '';   // remove placeholder text
}


const addCharToTS = (textChar) => {
    if (onEmptyState) {
        clearTSEmptyState();
    };

    // -- append new character
    curLineElmt.textContent += textChar;

    if (curLineElmt.textContent.length === MAX_LINE_LEN) {
        // -- insert a new empty line
        curLineElmt = document.createElement('span');
        textSpaceElmt.insertBefore(curLineElmt, cursorElmt);

        // -- update look of text space
        if (getNumLines() === MAX_LINES) {
            textSpaceElmt.classList.add('fade-out');
        }
        else if (getNumLines() > MAX_LINES) {
            const oldestLine = textSpaceElmt.firstElementChild;
            oldestLine.remove();
        };
    }
};


const deleteCharFromTS = () => {
    if (onEmptyState) {
        // -- return now, don't want to delete empty state text!
        return;
    };

    if (curLineElmt.textContent.length === 1 && getNumLines() === 1) {
        // -- bring back empty state
        curLineElmt.remove();
        setTSEmptyState();
        return;
    };

    if (curLineElmt.textContent.length === 0) {
        // -- remove current line
        curLineElmt.remove();
        curLineElmt = cursorElmt.previousElementSibling;

        // -- update look of text space
        if (getNumLines() < MAX_LINES) {
            textSpaceElmt.classList.remove('fade-out');
        };
    };

    // -- delete previous character
    curLineElmt.textContent = curLineElmt.textContent.slice(0, -1);
};


const getNumLines = () => {
    return textSpaceElmt.childElementCount - 1;
};


export { setTSEmptyState, addCharToTS, deleteCharFromTS };
