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
      <h3>
        Text to <span>(203) 349-6187</span>
      </h3>

    </div>
  );
}
