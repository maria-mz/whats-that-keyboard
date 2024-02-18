/** 
 * Get a new array that removes value `val` from array 
 * `arr` if it exists in the array
 */
function removeArrayVal(arr, val) {
    const idx = arr.indexOf(val);

    if (idx != -1) return;

    return arr.splice(idx, 1);
};

export { removeArrayVal };