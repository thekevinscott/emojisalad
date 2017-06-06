import React from 'react';

import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import * as styles from '../styles';

const HiddenButton = ({
  onPress,
  sectionID,
  rowID,
  rows,
  buttonStyle,
  children,
}) => (
  <TouchableHighlight
    onPress={() => {
      rows[`${sectionID}${rowID}`].closeRow();
      onPress();
    }}
    style={buttonStyle}
  >
    <Text style={styles.textBehind}>{ children }</Text>
  </TouchableHighlight>
);

const HiddenButtons = ({
  game,
  pauseGame,
  leaveGame,
  sectionID,
  rowID,
  rows,
}) => {
  return (
    <View style={styles.rowBehind}>
      <HiddenButton
        sectionID={sectionID}
        rowID={rowID}
        rows={rows}
        buttonStyle={styles.pause}
        onPress={() => {
          pauseGame(game);
        }}
      >
        Pause
      </HiddenButton>
      <HiddenButton
        sectionID={sectionID}
        rowID={rowID}
        rows={rows}
        buttonStyle={styles.leave}
        onPress={() => {
          leaveGame(game);
        }}
      >
        Leave
      </HiddenButton>
    </View>
  );
};

export default HiddenButtons;
