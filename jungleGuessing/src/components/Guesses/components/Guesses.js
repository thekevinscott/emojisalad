import React from 'react';
import Guess from './Guess';

export default function Guesses({
  guesses,
}: {
  guesses: Array,
}) {
  return (
    <div className="guesses">
      <div className="guess-container">
        {guesses.map(({
          message,
          number,
          created,
          correct,
        }, key) => (
          <Guess
            key={key}
            number={number}
            message={message}
            correct={correct}
            created={created}
          />
        ))}
      </div>
    </div>
  );
}

