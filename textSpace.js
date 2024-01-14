const MAX_LINE_CHARS = 50;

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
};

const clearTSEmptyState = () => {
    onEmptyState = false;

    curLineElmt.classList.remove('text-space-placeholder');
    curLineElmt.textContent = '';   // removes placeholder text
};


const addCharToTS = (textChar) => {
    if (onEmptyState) {
        clearTSEmptyState();
    };

    // -- append new character
    curLineElmt.textContent += textChar;

    if (curLineElmt.textContent.length === MAX_LINE_CHARS) {
        // -- insert a new empty line
        curLineElmt = document.createElement('span');
        textSpaceElmt.insertBefore(curLineElmt, cursorElmt);
    };
};

const addNewLineToTS = () => {
    if (onEmptyState) {
        // Note, "adds" a new empty line
        clearTSEmptyState();
    }
    else {
        curLineElmt = document.createElement('span');
        textSpaceElmt.insertBefore(curLineElmt, cursorElmt);
    };

    // -- insert break element before to give effect of new line
    const breakElmt = document.createElement('br');
    textSpaceElmt.insertBefore(breakElmt, curLineElmt);
};

const deleteCharFromTS = () => {
    if (onEmptyState) {
        // -- return now, don't want to delete empty state text!
        return;
    };

    if (curLineElmt.textContent.length === 1 && getNumLines() === 1) {
        // -- removing last char -> bring back empty state
        curLineElmt.remove();
        setTSEmptyState();
        return;
    };

    if (curLineElmt.textContent.length === 0) {
        removeAndMoveToPreviousLine();
    };

    if (curLineElmt.tagName.toLowerCase() === 'br') {
        // -- remove the <br> element
        removeAndMoveToPreviousLine();

        if (getNumLines() === 0) {
            setTSEmptyState();
        };
        return;
    };

    // -- delete prev char
    curLineElmt.textContent = curLineElmt.textContent.slice(0, -1);
};


// -- helper functions
const getNumLines = () => {
    return textSpaceElmt.childElementCount - 1;
};

const removeAndMoveToPreviousLine = () => {
    curLineElmt.remove();
    curLineElmt = cursorElmt.previousElementSibling;
};


export { setTSEmptyState, addCharToTS, addNewLineToTS, deleteCharFromTS };
