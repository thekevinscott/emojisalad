import React from 'react';
import SettingsButton from './components/SettingsButton';
import NewGameButton from './components/NewGameButton';

const navigationOptions = ({ navigation }) => {
  const games = (navigation.state.params || {}).games || [];
  const title = `Games (${games.length})`;

  return {
    title,
    headerLeft: (
      <SettingsButton
        navigate={navigation.navigate}
      />
    ),
    headerRight: (
      <NewGameButton
        navigate={navigation.navigate}
      />
    ),
  };
};

export default navigationOptions;
