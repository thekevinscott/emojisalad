const PURPLE = '#bb27dd';

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

export const rowContainer = {
  flex: 1,
  flexDirection: 'row',
};

const dotSize = 10;
export const unread = {
  paddingTop: 25,
  paddingLeft: 10,
  width: 30,
};

export const unreadDot = {
  width: dotSize,
  height: dotSize,
  borderRadius: dotSize,
  backgroundColor: PURPLE,
};
