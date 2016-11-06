import React, { Component, PropTypes } from 'react';
//import moment from 'moment';

const getTime = created => {
  const seconds = Math.ceil(((new Date()).getTime() - (new Date(created)).getTime()) / 1000);
  if (seconds > 60) {
    const minutes = Math.floor(seconds / 60);

    if (seconds === 1) {
      return {
        duration: minutes,
        timeString: 'minute ago',
      };
    }

    return {
      duration: minutes,
      timeString: 'minutes ago',
    };
  }

  if (seconds === 1) {
    return {
      duration: seconds,
      timeString: 'second ago',
    };
  }

  if (seconds < 5) {
    return {
      duration: seconds,
      timeString: 'seconds ago',
    };
  }

  return {
    duration: 'a few',
    timeString: 'seconds ago',
  };
};

export default class Guess extends Component {
  static propTypes = {
    number: PropTypes.string,
    message: PropTypes.string,
    created: PropTypes.any,
    correct: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = getTime(props.created);
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(getTime(this.props.created));
    }, 100);
  }

  render() {
    const {
      number,
      message,
      correct,
    } = this.props;

    const className = [
      'guess',
      correct ? 'correct' : null,
    ].join(' ');

    return (
      <div className={className}>
        <div className="header">
          <span className="number">{number}</span>
          <div className="time">
            <span className="duration">{this.state.duration}</span>
            <span className="durationString">{this.state.timeString}</span>
          </div>
        </div>
        <span className="message">{message}</span>
      </div>
    );
  }
}
