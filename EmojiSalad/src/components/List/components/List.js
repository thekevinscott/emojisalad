import React from 'react';
import PropTypes from 'prop-types';

import {
  //View,
  ListView,
} from 'react-native';

import Separator from './Separator';
import Row from './Row';
import SectionHeader from './SectionHeader';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

const renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => (
  <Separator
    sectionID={sectionID}
    rowID={rowID}
    adjacentRowHighlighted={adjacentRowHighlighted}
  />
);

const getData = data => {
  return ds.cloneWithRowsAndSections(data);
};

const getRenderSectionHeader = (headers = []) => {
  if (Object.keys(headers).length > 0) {
    return function renderSectionHeader(sectionData, id) {
      if (headers && headers[id]) {
        return (<SectionHeader>{ headers[id] }</SectionHeader>);
      }

      return null;
      //return (<SectionHeader data={id} />);
    };
  }

  return null;
};

const getOnPress = (onPress, data) => {
  if (onPress) {
    return function _onPress() {
      onPress(data);
    }
  }

  return null;
};

const List = ({
  data,
  onPress,
  headers,
  noRowPadding,
  refreshControl,
}) => {
  return (
    <ListView
      dataSource={getData(data)}
      enableEmptySections
      refreshControl={refreshControl}
      renderRow={data => (
        <Row
          data={data}
          onPress={getOnPress(onPress, data)}
          noRowPadding={noRowPadding || false}
        />
      )}
      renderSeparator={renderSeparator}
      renderSectionHeader={getRenderSectionHeader(headers)}
    />
  );
};

List.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  headers: PropTypes.object,
  noRowPadding: PropTypes.bool,
  refreshControl: PropTypes.node,
};

export default List;
