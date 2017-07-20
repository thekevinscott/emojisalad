import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {
  TouchableOpacity,
} from 'react-native';

const NewGameButton = ({
  navigate,
}) => (
  <TouchableOpacity
    onPress={() => {
      navigate('GameSettings');
    }}
  >
    <FontAwesomeIcon
      name="pencil-square-o"
      size={30}
    />
  </TouchableOpacity>
);

NewGameButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default NewGameButton;
