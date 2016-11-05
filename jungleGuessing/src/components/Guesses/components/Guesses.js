import React from 'react';
import Guess from './Guess';

export default function Guesses({
  guesses,
}: {
  guesses: Array,
}) {
  return (
    <div className="guesses">
      <h2>
        <span>
          <p>Text guesses to (203) 349-6187</p>
        </span>
      </h2>

      <div className="guess-container">
        {guesses.map(({
          message,
          number,
          created,
        }, key) => (
          <Guess
            key={key}
            number={number}
            message={message}
            created={created}
          />
        ))}
      </div>
    </div>
  );
}

