import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FBLogin,
} from 'react-native-facebook-login';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

const Logout = ({
  onLogout,
  actions: {
    localLogout,
  },
}) => {
  return (
    <FBLogin
      onLogout={() => {
        localLogout();
        if (onLogout) {
          onLogout();
        }
      }}
    />
  );
};

Logout.propTypes = {
  onLogout: PropTypes.func,
  actions: PropTypes.shape({
    localLogout: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
