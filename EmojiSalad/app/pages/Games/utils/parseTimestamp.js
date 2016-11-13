import moment from 'moment';

const parseTimestamp = timestamp => {
  const date = moment(timestamp);
  return date.fromNow();
};

export default parseTimestamp;
