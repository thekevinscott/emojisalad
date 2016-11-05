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
          Guesses
        </span>
      </h2>

      <div className="guess-container">
        {guesses.map((guess, key) => (
          <Guess
            key={key}
            guess={guess}
          />
        ))}
      </div>
    </div>
  );
}

