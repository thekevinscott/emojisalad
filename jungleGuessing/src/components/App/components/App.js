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
    fetchGuesses: PropTypes.func,
  };

  componentDidMount() {
    this.props.fetchGuesses();
  }

  render() {
    const {
      prompt,
      guesses,
    } = this.props;
    return (
      <div className="app">
        <Phrase prompt={prompt} />
        <Guesses guesses={guesses} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
