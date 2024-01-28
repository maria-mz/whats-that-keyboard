const MAX_LINE_CHARS = 50;


class TextSpace {
    constructor() {
        this.textSpaceElmt = document.createElement('section')
        this.textSpaceElmt.classList.add('text-space')

        this.cursorElmt = document.createElement('span')
        this.cursorElmt.textContent = '|'
        this.cursorElmt.classList.add('text-space__cursor')

        this.textSpaceElmt.appendChild(this.cursorElmt)

        this.onEmptyState;
        this.curLineElmt;

        this.setEmptyState()
    }

    render(parentElmt) {
        parentElmt.appendChild(this.textSpaceElmt)
    }

    remove() {
        this.textSpaceElmt.remove()
    }

    setEmptyState() {
        this.onEmptyState = true;

        const placeholder = document.createElement('span');
        placeholder.classList.add('text-space__placeholder');
        placeholder.textContent = 'Type away...';

        this.textSpaceElmt.insertBefore(placeholder, this.cursorElmt);
    
        this.curLineElmt = placeholder;
    };

    clearEmptyState() {
        this.onEmptyState = false;

        this.curLineElmt.classList.remove('text-space__placeholder');
        this.curLineElmt.textContent = ''; // Removes placeholder text
    };

    addChar(char) {
        if (this.onEmptyState) {
            this.clearEmptyState();
        };

        // Append new character
        this.curLineElmt.textContent += char;

        if (this.curLineElmt.textContent.length === MAX_LINE_CHARS) {
            // Insert a new empty line
            this.curLineElmt = document.createElement('span');
            this.textSpaceElmt.insertBefore(this.curLineElmt, this.cursorElmt);
        };
    };

    addNewLine() {
        if (this.onEmptyState) {
            // Note, "adds" a new empty line
            this.clearEmptyState();
        }
        else {
            this.curLineElmt = document.createElement('span');
            this.textSpaceElmt.insertBefore(this.curLineElmt, this.cursorElmt);
        };

        // Insert break element before to give effect of new line
        const breakElmt = document.createElement('br');
        this.textSpaceElmt.insertBefore(breakElmt, this.curLineElmt);
    };

    deleteChar() {
        if (this.onEmptyState) {
            // Return now, don't want to delete empty state text!
            return;
        };
    
        if (this.curLineElmt.textContent.length === 1 && this.getNumLines() === 1) {
            // Remove last char -> bring back empty state
            this.curLineElmt.remove();
            this.setEmptyState();
            return;
        };
    
        if (this.curLineElmt.textContent.length === 0) {
            this.removeAndMoveToPreviousLine();
        };
    
        if (this.curLineElmt.tagName.toLowerCase() === 'br') {
            // Remove the <br> element
            this.removeAndMoveToPreviousLine();
    
            if (this.getNumLines() === 0) {
                this.setEmptyState();
            };
            return;
        };
    
        // Delete prev char
        this.curLineElmt.textContent = this.curLineElmt.textContent.slice(0, -1);
    };

    // -- Helper methods
    getNumLines() {
        return this.textSpaceElmt.childElementCount - 1;
    };

    removeAndMoveToPreviousLine() {
        this.curLineElmt.remove();
        this.curLineElmt = this.cursorElmt.previousElementSibling;
    };
};

export default TextSpace;
