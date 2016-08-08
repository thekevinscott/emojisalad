import moment from 'moment';

export default function daysAgo(days = 0) {
  return moment().subtract(days, 'days').format('X');
}
