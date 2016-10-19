import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

const getAttemptString = attempts => {
  if (attempts === 1) {
    return '1 attempt';
  }

  return `${attempts} attempts`;
};

export function selectStatus({
  router: {
    websocket: {
      attempts,
      connected,
    },
  },
}) {
  if (connected) {
    const t = moment(connected);
    const time = t.format('HH:mm:ss a');
    return (
      <View>
        <Text>
          {`Connected at ${time}`}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <ActivityIndicator />
      <Text>
        {`Connecting to Server: ${getAttemptString(attempts)}`}
      </Text>
    </View>
  );
}
