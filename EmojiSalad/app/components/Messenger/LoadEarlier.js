import React from 'react';

import { LaddaButton } from '../LaddaButton';

export default function LoadEarlier({
  isLoading,
  handleLoadEarlier,
}) {
  return (
    <LaddaButton
      onLoadEarlier={handleLoadEarlier}
      isLoading={isLoading}
    />
  );
}

