import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';
import { Base } from '../base';

export var Phrases = React.createClass({
  render: function () {
    return (
      <div className="phrases page">
        <h1>Phrases Page</h1>
        <p>This is prhase</p>
        <div className="header">
          Phrases Header
        </div>
      </div>
    );
  }
});

