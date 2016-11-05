import React from 'react';

export default function Phrase({
  prompt,
}: {
  prompt: string
}) {
  return (
    <div className="prompt">
      <h1>{prompt}</h1>
    </div>
  );
}
