import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Phrase } from '../../Phrase';
import { Guesses } from '../../Guesses';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class App extends Component {
  static propTypes = {
    guesses: PropTypes.array,
    prompt: PropTypes.string,
    phrase: PropTypes.string,
    fetchGuesses: PropTypes.func,
    goToNextPhrase: PropTypes.func,
    correct: PropTypes.bool,
  };

  componentDidMount() {
    this.props.fetchGuesses();
    window.addEventListener('keydown', e => {
      if ([
        'KeyN',
        'KeyB',
      ].indexOf(e.code) !== -1) {
        this.props.goToNextPhrase(e.code === 'KeyN');
      }
    });
  }

  render() {
    const {
      prompt,
      phrase,
      guesses,
      correct,
    } = this.props;

    return (
      <div className="app">
        <Phrase
          prompt={prompt}
          phrase={phrase}
          blurred={!correct}
        />
        <Guesses guesses={guesses} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
