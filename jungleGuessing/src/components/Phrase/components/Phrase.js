import React from 'react';


export default function Phrase({
  prompt,
  phrase,
  blurred,
}: {
  prompt: string,
  phrase: string,
  blurred: any,
}) {
  return (
    <div className="prompt">
      <h1>{prompt}</h1>
      <h2>
        <span className={blurred ? 'blurred' : null}>
          {phrase}
        </span>
      </h2>
    </div>
  );
}
