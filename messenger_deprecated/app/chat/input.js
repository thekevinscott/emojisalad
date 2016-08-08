var React = require('react');

var Input = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var node = this.refs.input.getDOMNode();
    this.props.onSubmit(node.value);
    node.value = '';
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
      <input ref="input" className="inputMessage" placeholder="Type here..."/>
      </form>
    );
  }
});

module.exports = Input;
