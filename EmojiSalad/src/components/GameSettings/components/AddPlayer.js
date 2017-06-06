import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
} from 'react-native';

import * as styles from '../styles';

import { Add } from 'components/Icon';

const AddPlayer = ({
  findPlayerToInvite,
}) => {
  return (
    <TouchableOpacity
      onPress={findPlayerToInvite}
      style={styles.addPlayer}
    >
      <Add
        onPress={findPlayerToInvite}
        color="#0076FF"
      />
      <Text style={styles.addPlayerText}>
        Add Player To This Game
      </Text>
    </TouchableOpacity>
  );
}

AddPlayer.propTypes = {
  findPlayerToInvite: PropTypes.func.isRequired,
};

export default AddPlayer;
