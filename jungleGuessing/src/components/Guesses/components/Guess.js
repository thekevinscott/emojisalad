import React from 'react';
import moment from 'moment';

export default function Guess({
  number,
  message,
  created,
}: {
  number: string,
  message: string,
  created: any,
}) {
  const createdString = moment(new Date(created)).format('h:mm:ssA');
  return (
    <div className="guess">
      <span className="number">{number}</span>
      <span className="guess">{message}</span>
      <span className="created">{createdString}</span>
    </div>
  );
}
