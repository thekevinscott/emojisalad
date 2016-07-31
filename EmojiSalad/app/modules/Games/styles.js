export const container = {
  paddingTop: 64,
};

export const row = {
  backgroundColor: '#FFF',
  padding: 20,
  justifyContent: 'center',
};

export const rowText = {
};

export const rowSeparator = (adjacentRowHighlighted) => ({
  height: adjacentRowHighlighted ? 4 : 1,
  backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
});
