const MAX_LINE_LEN = 50;
const MAX_LINES = 5;

let numLines = 0;
let curLineText = '';   // typed by user
let curLineElmt;

let textSpaceElmt = document.getElementById('textSpace')
let cursorElmt = textSpaceElmt.lastElementChild


const putEmptyState = () => {
    const placeholder = document.createElement('span');
    placeholder.classList.add('text-space-placeholder');
    placeholder.textContent = 'Type away...';
    textSpaceElmt.insertBefore(placeholder, cursorElmt);

    numLines = 1;
    curLineElmt = placeholder;
}


const addChar = (textChar) => {
    // TODO: think of better way to handle placeholder
    curLineElmt.classList.remove('text-space-placeholder');

    if (curLineText.length + 1 === MAX_LINE_LEN) {
        // on the last character for the line, add it to the current line,
        // and create a new line
        updateLine(curLineText + textChar)

        curLineElmt = document.createElement('span');
        textSpaceElmt.insertBefore(curLineElmt, cursorElmt);
        numLines += 1;
        curLineText = '';
    }
    else {
        updateLine(curLineText + textChar)
    };

    if (numLines === MAX_LINES) {
        textSpaceElmt.classList.add('fade-out')
    }
    else if (numLines > MAX_LINES) {
        // remove oldest line
        const firstLine = textSpaceElmt.firstElementChild;
        firstLine.remove();
        numLines -= 1;
    };
};


const deleteChar = () => {
    updateLine(curLineText.slice(0, -1))

    if (curLineText.length == 0) {
        curLineElmt.remove();
        numLines -= 1;

        if (numLines === 0) {
            putEmptyState()
        }
        else {
            curLineElmt = cursorElmt.previousElementSibling;
            curLineText = curLineElmt.textContent;
        };
    } 
    else {
        if (numLines < MAX_LINES) {
            textSpaceElmt.classList.remove('fade-out')
        };
    };
};


const updateLine = (newText) => {
    curLineText = newText;
    curLineElmt.textContent = newText;
}


export { putEmptyState, addChar, deleteChar };
