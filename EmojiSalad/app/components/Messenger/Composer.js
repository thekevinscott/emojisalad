import React from 'react';

import {
  TextInput,
} from 'react-native';

import * as styles from './styles';

export default function Composer({
  updateCompose,
  handleSend,
  value,
}) {
  return (
    <TextInput
      placeholder="Message"
      multiline={false}
      autoCorrect={false}

      placeholderTextColor={styles.placeholder.color}
      style={styles.composer}

      onChangeText={updateCompose}
      underlineColorAndroid="transparent"
      onSubmitEditing={handleSend}
      value={value}
    />
  );
}
