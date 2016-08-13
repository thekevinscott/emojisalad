/* globals window */
import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';
import { Base } from './base';
const Link = Router.Link;

export const Logs = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/logs',
  render: function () {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const logs = this.state.data.files.map(log => (
        <tr key={log.path}>
          <td><Link to="log" params={{log: log.path}}>{log.path}</Link></td>
          <td>{log.mtime}</td>
        </tr>
      ));

      content = (
        <div>
          <table>
            <thead>
              <tr>
                <td>Log</td>
                <td>Updated</td>
              </tr>
            </thead>
            <tbody>
              {logs}
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <div className="logs page">
        {content}
      </div>
    );
  }
});

const socket = window.socket;
export const Log = React.createClass({
  mixins: [Base], // Use the mixin
  componentDidMount: function() {
    document.title = `Log: ${this.props.params.log}`;
  },
  url: function() {
    return `/api/logs/${this.props.params.log}`;
  },
  receiveData: function(resp) {
    this.setState({
      data: {
        // remove the final new line, so we can add it in transparently later
        contents: resp.contents.substring(0, resp.contents.length-1)
      },
      forceScroll: true
    });
  },
  componentDidMount: function() {
    // Add a connect listener
    socket.on('connect',function() {
      socket.send({
        type: 'subscribe',
        path: this.props.params.log
      });
    }.bind(this));
    // Add a connect listener
    socket.on('message', this.message);
  },
  message: function(data) {
    const contents = `${this.state.data.contents}\n${data.data}`;
    this.setState({
      data: {
        contents
      }
    });
  },
  componentWillUpdate: function() {
    if (this.refs.logfile) {
      const node = this.refs.logfile.getDOMNode();
      this.shouldScrollBottom = node.scrollTop + node.offsetHeight >= node.scrollHeight - 10;
    }
  },
  componentDidUpdate: function() {
    if (this.refs.logfile && (this.shouldScrollBottom || this.state.forceScroll )) {
      const node = this.refs.logfile.getDOMNode();
      node.scrollTop = node.scrollHeight;
      if (this.state.forceScroll) {
        this.setState({
          forceScroll: false
        });
      }
    }
  },
  render: function () {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      content = (
        <div className="logfile" ref="logfile" scrollTop={400}>
          <pre>
            {this.state.data.contents}
          </pre>
        </div>
      );
    }
    return (
      <div className="log page">
        {content}
      </div>
    );
  }
});
