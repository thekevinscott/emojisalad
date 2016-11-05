import React from 'react';
import { connect } from 'react-redux';
import { Phrase } from '../../Phrase';
import { Guesses } from '../../Guesses';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

function App({
  prompt,
  guesses,
}: {
  prompt: string,
  guesses: Array,
}) {
  return (
    <div className="app">
      <Phrase prompt={prompt} />
      <Guesses guesses={guesses} />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
