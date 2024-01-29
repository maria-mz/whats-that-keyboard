import CHALLENGE_LETTERS from '../../challengeLetters.js';
import { getKeyLayout, getMappedLetter, isLetter, convertCharCase } from '../utils/KeyboardUtils.js';


const SPACE_KEY = ' '
const ENTER_KEY = 'Enter'
const BACKSPACE_KEY = 'Backspace'


class Keyboard {
    constructor(textSpace) {
        this.textSpace = textSpace;

        this.challengeKeyLayout = getKeyLayout(CHALLENGE_LETTERS);
        this.getMappedLetter = getMappedLetter(this.challengeKeyLayout);

        this.keyboardElmt = document.createElement('div');
        this.keyboardElmt.id = 'keyboard';
        this.keyboardElmt.classList.add('keyboard');
      
        Object.values(this.createRowElmts()).forEach((keyboardRow) => {
            this.keyboardElmt.appendChild(keyboardRow);
        });
    };

    getKeyboardElmt() {
        return this.keyboardElmt;
    };

    // -- Event Handler methods 
    keydownEventHandler(e) {
        if (e.key === SPACE_KEY) {
            this.textSpace.addChar('\u00A0');
            return;
        };
        if (e.key === ENTER_KEY) {
            this.textSpace.addNewLine();
            return;
        };
        if (e.key === BACKSPACE_KEY) {
            this.textSpace.deleteChar();
            return;
        };
        if (!isLetter(e.key)) return;

        const mappedLetter = this.getMappedLetter(e.key.toUpperCase());
        const keyLoc = this.challengeKeyLayout[mappedLetter];

        this.textSpace.addChar(convertCharCase(e.key, mappedLetter));

        const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
            .querySelector(`[idx="${keyLoc.idx}"]`);

        keyElement.classList.add('key-pressed');
    };

    keyupEventHandler(e) {
        if (!isLetter(e.key)) return;

        const mappedLetter = this.getMappedLetter(e.key.toUpperCase());
        const keyLoc = this.challengeKeyLayout[mappedLetter];

        const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
            .querySelector(`[idx="${keyLoc.idx}"]`);

        keyElement.classList.remove('key-pressed');
    };

    // -- Helper methods
    createKeyElmt(idx, letter) {
        const keyElmt = document.createElement('div');
    
        keyElmt.className = 'key';
        keyElmt.textContent = letter.toUpperCase();
        keyElmt.setAttribute('idx', idx);
    
        return keyElmt;
    };

    createRowElmt(row) {
        const keyboardRowElmt = document.createElement('div');
    
        keyboardRowElmt.className = 'keyboard__row';
        keyboardRowElmt.id = `keyboardRow${row}`;
    
        return keyboardRowElmt;
    };

    createRowElmts() {
        const keyboardRowElmts = {};

        for (const [letter, { row, idx }] of Object.entries(this.challengeKeyLayout)) {
            if (!keyboardRowElmts.hasOwnProperty(row)) {
                keyboardRowElmts[row] = this.createRowElmt(row);
            };
      
            const keyElmt = this.createKeyElmt(idx, letter);
            keyboardRowElmts[row].appendChild(keyElmt);
        };

        return keyboardRowElmts;
    };
};

export default Keyboard;
