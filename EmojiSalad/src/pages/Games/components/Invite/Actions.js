import React from 'react';
import PropTypes from 'prop-types';

import { Cancel, Confirm } from 'components/Icon';

import {
  View,
} from 'react-native';

import * as styles from './styles';

const Button = ({
  children,
}) => (
<View style={styles.button}>
  { children }
</View>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

const Actions = ({
  confirmInvite,
  cancelInvite,
}) => {
  return (
    <View style={styles.actions}>
      <Button>
        <Cancel
          color="#FE3824"
          onPress={cancelInvite}
          size={39}
        />
      </Button>
      <Button>
        <Confirm
          color="#0076FF"
          onPress={confirmInvite}
          size={39}
        />
      </Button>
    </View>
  );
};

Actions.propTypes = {
  confirmInvite: PropTypes.func.isRequired,
  cancelInvite: PropTypes.func.isRequired,
};

export default Actions;
