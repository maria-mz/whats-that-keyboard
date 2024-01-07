const lettersToLayout = letters => {
  const lettersCopy = [...letters]; // because .shift() modifies original array
  const keysPerRow = [10, 9, 7];  // typical keyboard layout
  const keyLayout = {};

  keysPerRow.forEach((keysPerRow, row) => {
      for (let idx = 0; idx < keysPerRow; idx++) {
          const letter = lettersCopy.shift();
          keyLayout[letter.toUpperCase()] = {row: row, idx: idx};
      };
  });

  return keyLayout;
}

const getKeytoKeyMap = (keyLayoutMapFrom, keyLayoutMapTo, isCaps) => {
  const map = {};

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
          if (isCaps) {
              map[letterFrom.toUpperCase()] = letterTo.toUpperCase();
          }
          else {
              map[letterFrom.toLowerCase()] = letterTo.toLowerCase();
          };
      };
  };

  return map;
};

export { lettersToLayout, getKeytoKeyMap };
