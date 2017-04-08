import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Status } from 'components/Status';

import {
  View,
} from 'react-native';

import styles from '../styles';

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
        <PageContents
          {...this.props}
        />
      </View>
    );
  }
}

export default connect(
)(Page);
