import moment from 'moment';

const parseTimestamp = timestamp => {
  if (timestamp) {
    const date = moment(timestamp);
    return date.fromNow();
  }

  return '';
};

export default parseTimestamp;
