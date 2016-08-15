const PURPLE = '#bb27dd';
const ROW_HEADER_HEIGHT = 20;
const ROW_HEIGHT = 100;
const MESSAGE_TOP = ROW_HEADER_HEIGHT + 20;
const ROW_PADDING = 20;
export const MESSAGE_FADEIN_DURATION = 200;
export const MESSAGE_SLIDE_DURATION = 500;

export const container = {
  paddingTop: 64,
};

export const game = {
  backgroundColor: '#FFF',
  padding: ROW_PADDING,
  paddingTop: 0,
  overflow: 'hidden',
  //justifyContent: 'center',
  flex: 1,
  flexDirection: 'row',
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
  height: ROW_HEADER_HEIGHT + ROW_PADDING,
  paddingTop: ROW_PADDING,
  backgroundColor: 'white',
  overflow: 'hidden',
};

export const rowSeparator = (adjacentRowHighlighted) => ({
  height: adjacentRowHighlighted ? 4 : 1,
  backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
});

export const rowContainer = {
  flex: 1,
  flexDirection: 'row',
  // if we don't specify explicit height,
  // we'll need to expand this based on the
  // length of the message
  height: ROW_HEIGHT,
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

export const messagesContainer = {
  flex: 1,
  position: 'absolute',
  left: ROW_PADDING,
  right: ROW_PADDING,
  top: MESSAGE_TOP,
  backgroundColor: 'white',
};
