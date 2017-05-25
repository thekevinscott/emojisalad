import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';

const getName = ({
  name,
  nickname,
  avatar,
}) => {
  if (nickname) {
    return (
      <View style={{
        flexDirection: 'row',
      }}>
        {avatar && (
          <Text style={{
            marginRight: 10,
          }}>
          {`${avatar}`}
        </Text>
        )}
        <Text>
          {`${nickname} (${name})`}
        </Text>
      </View>
    );
  }

  return (<Text>{ name }</Text>);
};

const Friend = ({
  friend,
}) => {
  return (
    <View friend={friend}>
      { getName(friend) }
    </View>
  );
};

Friend.propTypes = {
  friend: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Friend;
