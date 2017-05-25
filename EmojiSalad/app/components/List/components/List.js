import React from 'react';
import PropTypes from 'prop-types';

import {
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

const getData = data => ds.cloneWithRowsAndSections(data);

const List = ({
  data,
  onPress,
  headers,
}) => (
  <ListView
    dataSource={getData(data)}
    renderRow={data => (
      <Row
        data={data}
        onPress={() => onPress(data)}
      />
    )}
    renderSeparator={renderSeparator}
    renderSectionHeader={(sectionData, id) => {
      if (headers && headers[id]) {
        return (<SectionHeader>{ headers[id] }</SectionHeader>);
      }

      return null;
      //return (<SectionHeader data={id} />);
    }}
  />
);

List.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  headers: PropTypes.object,
};

export default List;

