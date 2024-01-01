// TODO: placeholder for now, will get letters from database
const lettersQWERTY = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
]

const lettersGen = [
    'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W','Q', 'L', 'K', 'J',
    'H', 'G', 'F', 'D', 'S', 'A', 'M', 'N', 'B', 'V', 'C', 'X', 'Z'
]


const parseLettersToLayout = letters => {
    const lettersCopy = [...letters]; // because .shift() modifies original array
    const keysPerRow = [10, 9, 7];  // standard keyboard layout
    const keyLayout = {};

    keysPerRow.forEach((keysPerRow, row) => {
        for (let idx = 0; idx < keysPerRow; idx++) {
            const letter = lettersCopy.shift();
            keyLayout[letter] = {row: row, idx: idx};
        };
    });

    return keyLayout;
}


const getKeytoKeyMap = (keyLayoutMapFrom, keyLayoutMapTo) => {
    const map = {}

    for (
        const [
            letterFrom, { row: rowFrom, idx: idxFrom }
        ] of Object.entries(keyLayoutMapFrom)
    ) {
        const match = Object.entries(keyLayoutMapTo)
            .find(([_, { row: rowTo, idx: idxTo }]) =>
                rowFrom === rowTo && idxFrom === idxTo
            );

        if (match) {
            const [letterTo] = match;
            map[letterFrom] = letterTo;
        };
    };

    return map
};


const keyLayoutGen = parseLettersToLayout(lettersGen);

const keyQWERTYToKeyGen = getKeytoKeyMap(
    parseLettersToLayout(lettersQWERTY), keyLayoutGen
)


// Render keyboard.
// TODO: placeholder for now, should be done on `play game`
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded!");

    const createKey = (idx, letter) => {
        const key = document.createElement('div');
        key.className = 'key';
        key.setAttribute('idx', idx);

        const keySurface = document.createElement('div');
        keySurface.className = 'key-idle';
        keySurface.textContent = letter.toUpperCase();

        key.appendChild(keySurface);

        return key;
    };

    const createKeyboardRow = row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard__row';
        keyboardRow.id = `keyboardRow${row}`;

        return keyboardRow;
    };

    const keyboardRows = {};

    for (const [letter, { row, idx }] of Object.entries(keyLayoutGen)) {
        if (!keyboardRows.hasOwnProperty(row)) {
            keyboardRows[row] = createKeyboardRow(row);
        };

        const keyElement = createKey(idx, letter);
        keyboardRows[row].appendChild(keyElement);
    };

    const keyboard = document.getElementById('keyboard');

    Object.values(keyboardRows).forEach(keyboardRow => {
        keyboard.appendChild(keyboardRow);
    });

});


// Keyboard event listeners
document.addEventListener('keydown', event => {
    const keyLoc = keyLayoutGen[
        keyQWERTYToKeyGen[event.key.toUpperCase()]
    ];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    const keySurface = keyElement.querySelector('.key-idle');

    if (keySurface && keySurface.classList.contains('key-idle')) {
        keySurface.classList.remove('key-idle');
        keySurface.classList.add('key-pressed');
    };

});

document.addEventListener('keyup', event => {
    const keyLoc = keyLayoutGen[
        keyQWERTYToKeyGen[event.key.toUpperCase()]
    ];

    // Means non-letter key was pressed
    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[idx="${keyLoc.idx}"]`);

    const keySurface = keyElement.querySelector('.key-pressed');

    if (keySurface && keySurface.classList.contains('key-pressed')) {
        keySurface.classList.remove('key-pressed');
        keySurface.classList.add('key-idle');
    };

});
