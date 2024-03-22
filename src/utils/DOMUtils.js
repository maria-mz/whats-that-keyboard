/** 
 * Functions for working with DOM elements within the window
 */


/** 
 * Get left X-coordinate of HTML element `elmt` in viewport
 */
function getX(elmt) {
    return elmt.getBoundingClientRect().left;
};

/**
* Get top Y-coordinate of HTML element `elmt` in viewport
*/
function getY(elmt) {
    return elmt.getBoundingClientRect().top;
};

/**
* Move an HTML element `elmt` to coordinates `x` and `y`
*/
function moveElmtTo(elmt, x, y) {
    elmt.style.left = x + 'px';
    elmt.style.top = y + 'px';
};

/**
* Adjust the current position of an HTML element `elmt` to
* keep it within the visible window
*/
function boundElmtInsideWindow(elmt) {
    const x = getX(elmt);
    const y = getY(elmt);

    let boundedX;
    let boundedY;

    if (x < 0) {
        // Prevents going outside Left edge
        boundedX = 0;
    } else {
        // Prevents going outside Right edge
        const maxX = window.innerWidth - elmt.offsetWidth;
        boundedX = Math.min(x, maxX);
    };

    if (y < 0) {
        // Prevents going outside Top edge
        boundedY = 0;
    } else {
        // Prevents going outside Bottom edge
        const maxY = window.innerHeight - elmt.offsetHeight;
        boundedY = Math.min(y, maxY);
    };

    moveElmtTo(elmt, boundedX, boundedY);
};


export { getX, getY, moveElmtTo, boundElmtInsideWindow };
