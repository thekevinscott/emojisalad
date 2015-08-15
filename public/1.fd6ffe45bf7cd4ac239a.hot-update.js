webpackHotUpdate(1,{

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _reactRouter = __webpack_require__(3);

	var Router = _interopRequireWildcard(_reactRouter);

	var _reqwest = __webpack_require__(2);

	var _reqwest2 = _interopRequireDefault(_reqwest);

	var _auth = __webpack_require__(8);

	var _base = __webpack_require__(28);

	var Messages = React.createClass({
	  displayName: 'Messages',

	  mixins: [_base.Base], // Use the mixin
	  url: '/api/messages',
	  render: function render() {
	    var content;
	    if (this.state.loading) {
	      content = "Loading";
	    } else if (this.state.error) {
	      content = this.state.error;
	    } else {
	      var messages = this.state.data.map(function (message) {
	        return React.createElement(
	          'tr',
	          null,
	          React.createElement(
	            'td',
	            null,
	            message.key
	          ),
	          React.createElement(
	            'td',
	            null,
	            message.message
	          ),
	          React.createElement(
	            'td',
	            null,
	            'x'
	          )
	        );
	      });
	      content = React.createElement(
	        'table',
	        null,
	        React.createElement(
	          'thead',
	          null,
	          React.createElement(
	            'tr',
	            null,
	            React.createElement(
	              'td',
	              null,
	              'Key'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Message'
	            ),
	            React.createElement(
	              'td',
	              null,
	              'Delete'
	            )
	          )
	        ),
	        messages
	      );
	    }
	    return React.createElement(
	      'div',
	      { className: 'players page' },
	      content
	    );
	  }
	});
	exports.Messages = Messages;

/***/ }

})