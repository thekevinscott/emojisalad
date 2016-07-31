export const container = {
  paddingTop: 64,
};

export const row = {
  backgroundColor: '#FFF',
  padding: 20,
  //justifyContent: 'center',
  flex: 1,
};

export const players = {
  flex: 1,
  fontWeight: 'bold',
};

export const message = {
  //height: 20,
};

export const timestamp = {
  paddingLeft: 20,
  textAlign: 'right',
};

export const rowHeader = {
  flex: 1,
  flexDirection: 'row',
};

export const rowSeparator = (adjacentRowHighlighted) => ({
  height: adjacentRowHighlighted ? 4 : 1,
  backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
});
