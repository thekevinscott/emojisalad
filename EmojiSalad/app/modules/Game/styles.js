export const container = {
  paddingTop: 64,
  backgroundColor: '#CCC',
};

export const row = {
  backgroundColor: '#CCC',
  padding: 20,
  justifyContent: 'center',
};

export const rowText = {
};

export const rowSeparator = (adjacentRowHighlighted) => ({
  height: adjacentRowHighlighted ? 4 : 1,
  backgroundColor: adjacentRowHighlighted ? '#AAA' : '#333',
});
