import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Status } from 'components/Status';

import {
  View,
} from 'react-native';

import styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Page extends Component {
  constructor(props) {
    super(props);
    if (!this.props.page) {
      console.error(`No page provided for ${this.props.key}`);
    }
  }

  render() {
    const {
      page: PageContents,
    } = this.props;

    return (
      <View style={{
        ...styles.page,
      }}>
      <Status
        {...this.props.status}
      />
        <PageContents />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
