export const BUTTON = {
  PADDING: 10,
  HEIGHT: 40,
  MARGIN: 20,
  WIDTH: {
    REST: 200,
    LOADING: 40,
  },
  BORDER_RADIUS: {
    REST: 20,
    LOADING: 500,
  },
};

export const SPINNER = {
  SIZE: 30,
};

export const ANIMATION = {
  DURATION: 300,
  DAMPING: 0.5,
};

export const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    margin: BUTTON.MARGIN,
    padding: BUTTON.PADDING,
    width: BUTTON.WIDTH,
    height: BUTTON.HEIGHT,

    backgroundColor: '#AAA',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  spinner: {
    width: SPINNER.SIZE,
    height: SPINNER.SIZE,
    opacity: 1,
    position: 'absolute',
    top: BUTTON.PADDING / 2,
  },
  text: {
    textAlign: 'center',
  },
};
