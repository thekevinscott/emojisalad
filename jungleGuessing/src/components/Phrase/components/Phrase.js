import React from 'react';

export default function Phrase({
  prompt,
}: {
  prompt: string
}) {
  return (
    <div className="prompt">
      {prompt}
    </div>
  );
}
