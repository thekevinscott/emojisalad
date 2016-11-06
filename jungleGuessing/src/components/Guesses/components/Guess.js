import React from 'react';
import moment from 'moment';

export default function Guess({
  number,
  message,
  created,
  correct,
}: {
  number: string,
  message: string,
  created: any,
  correct: any,
}) {
  //const createdString = moment(new Date(created)).format('h:mm:ss A');
  const createdString = moment(new Date(created)).fromNow(true);
  const className = [
    'guess',
    correct ? 'correct' : null,
  ].join(' ');
  return (
    <div className={className}>
      <span className="number">{number}</span>
      <span className="message">{message}</span>
      <span className="created">{createdString}</span>
    </div>
  );
}
