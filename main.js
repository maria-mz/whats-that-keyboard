const KeyMappingsQWERTY = {
    // First row
    'q': { row: 0, pos: 0 },
    'w': { row: 0, pos: 1 },
    'e': { row: 0, pos: 2 },
    'r': { row: 0, pos: 3 },
    't': { row: 0, pos: 4 },
    'y': { row: 0, pos: 5 },
    'u': { row: 0, pos: 6 },
    'i': { row: 0, pos: 7 },
    'o': { row: 0, pos: 8 },
    'p': { row: 0, pos: 9 },

    // Second row
    'a': { row: 1, pos: 0 },
    's': { row: 1, pos: 1 },
    'd': { row: 1, pos: 2 },
    'f': { row: 1, pos: 3 },
    'g': { row: 1, pos: 4 },
    'h': { row: 1, pos: 5 },
    'j': { row: 1, pos: 6 },
    'k': { row: 1, pos: 7 },
    'l': { row: 1, pos: 8 },

    // Third row
    'z': { row: 2, pos: 0 },
    'x': { row: 2, pos: 1 },
    'c': { row: 2, pos: 2 },
    'v': { row: 2, pos: 3 },
    'b': { row: 2, pos: 4 },
    'n': { row: 2, pos: 5 },
    'm': { row: 2, pos: 6 },
}

document.addEventListener('keydown', (event) => {
    const keyLoc = KeyMappingsQWERTY[event.key]

    if (!keyLoc) return;

    const keyElement = document.getElementById(`keyboardRow${keyLoc.row}`)
        .querySelector(`[pos="${keyLoc.pos}"]`);

    if (!keyElement) return;

    const keySurface = keyElement.querySelector('.key-idle');

    if (keySurface && keySurface.classList.contains('key-idle')) {
        keySurface.classList.remove('key-idle');
        keySurface.classList.add('key-pressed');
    }

});

document.addEventListener('keyup', function(event) {
    const keyLoc = KeyMappingsQWERTY[event.key]

    if (!keyLoc) return;

    const keyElement = document.querySelector(
        `.keyboard__row-${keyLoc.row} .key[pos="${keyLoc.pos}"]`
    );

    if (!keyElement) return;

    const keySurface = keyElement.querySelector('.key-pressed');

    if (keySurface && keySurface.classList.contains('key-pressed')) {
        keySurface.classList.remove('key-pressed');
        keySurface.classList.add('key-idle');
    }

});

