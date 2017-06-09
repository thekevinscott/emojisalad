//const PURPLE = '#bb27dd';
const BLUE = '#0076FF';
const GRAY = '#8F8E94';
const ROW_HEADER_HEIGHT = 20;
const ROW_HEIGHT = 100;
//const MESSAGE_TOP = ROW_HEADER_HEIGHT + 20;
const MESSAGE_TOP = 30;
const ROW_PADDING = 8;
const BG_COLOR = '#fff';
export const MESSAGE_FADEIN_DURATION = 200;
export const MESSAGE_SLIDE_DURATION = 500;

export const container = {
};

export const list = {
  paddingTop: 80,
  flex: 1,
};

export const listContainer = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
};

export const text = {
  textAlign: 'center',
  color: 'blue',
  padding: 10,
  paddingLeft: 40,
  paddingRight: 40,
  fontSize: 18,
};

export const games = {
  //paddingTop: HEADER_HEIGHT,
  flex: 1,
};

export const row = {
  backgroundColor: BG_COLOR,
  height: 58,
  padding: ROW_PADDING,
  overflow: 'hidden',
  //justifyContent: 'center',
  flex: 1,
  flexDirection: 'row',
};

export const game = {
  backgroundColor: BG_COLOR,
  padding: ROW_PADDING,
  paddingTop: 0,
  paddingRight: 9,
  overflow: 'hidden',
  //justifyContent: 'center',
  flex: 1,
  flexDirection: 'row',
};

export const players = {
  flex: 1,
  //fontWeight: 'bold',
};

export const message = {
  color: GRAY,
  //height: 20,
};

export const timestamp = {
  color: GRAY,
  paddingLeft: 20,
  textAlign: 'right',
  paddingRight: 10,
};

export const rowHeader = {
  flex: 1,
  flexDirection: 'row',
  height: ROW_HEADER_HEIGHT + ROW_PADDING,
  paddingTop: ROW_PADDING,
  backgroundColor: BG_COLOR,
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
  paddingLeft: 0,
  width: 30,
  marginRight: 30,
  backgroundColor: BG_COLOR,
};

export const unreadDot = {
  width: dotSize,
  height: dotSize,
  borderRadius: dotSize,
  backgroundColor: BLUE,
};

export const messagesContainer = {
  flex: 1,
  position: 'absolute',
  left: ROW_PADDING,
  right: ROW_PADDING,
  top: MESSAGE_TOP,
  backgroundColor: BG_COLOR,
};

export const activityIndicator = {
  marginRight: 10,
};

export const rowBehind = {
  alignItems: 'center',
  backgroundColor: '#DDD',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: 15,
};

export const buttonBehind = {
  alignItems: 'center',
  bottom: 0,
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  width: 100,
};

export const pause = {
  ...buttonBehind,
  backgroundColor: 'blue',
  right: buttonBehind.width * 1,
};

export const leave = {
  ...buttonBehind,
  backgroundColor: 'red',
  right: 0,
};

export const textBehind = {
  color: 'white',
};
